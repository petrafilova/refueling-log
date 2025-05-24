import fs from 'fs';
import path from 'path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import vehicleRoutes from './routes/vehicle';
import fuelLogRoutes from './routes/fuelLog';
import vehicleFuelRoutes from './routes/vehicleFuel';
import statsRoutes from './routes/stats';
import expenseLogRoutes from './routes/expensesLog';
import expenseTypeRoutes from './routes/expensesType';
import authRoutes from './routes/auth';
import hasError from './middleware/has-error';
import CustomError from './models/customError';
import { CUSTOM_ERROR_CODES } from './models/errorCodes';

export const app = express();

const openapiFilePath = path.join(__dirname, 'openapi.json');
const openapiFile = JSON.parse(fs.readFileSync(openapiFilePath, 'utf-8'));
const basePath = String(process.env.BASE_PATH ?? '/api');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const router = express.Router();

router.use('/vehicle', vehicleRoutes);
router.use('/vehicleFuel', vehicleFuelRoutes);
router.use('/fuelLog', fuelLogRoutes);
router.use('/expenseLog', expenseLogRoutes);
router.use('/expenseType', expenseTypeRoutes);
router.use('/stats', statsRoutes);
router.use('/auth', authRoutes);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiFile));
router.get('/api-docs/openapi.json', (req, res) => res.json(openapiFile));

router.get('/health', (req, res) => {
    res.send('ok');
});

app.use(basePath, router);

app.use(hasError);
