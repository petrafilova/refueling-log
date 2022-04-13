import fs from 'fs';
import path from 'path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import vehicleRoutes from './routes/vehicle';
import fuelLogRoutes from './routes/fuelLog';
import vehicleFuelRoutes from './routes/vehicleFuel';
import statsRoutes from './routes/stats';
import expenseLogRoutes from './routes/expensesLog';
import expenseTypeRoutes from './routes/expensesType';
import authRoutes from './routes/auth';
import hasError from './middleware/has-error';

export const app = express();

const openapiFilePath = path.join(__dirname, 'openapi.json');
const openapiFile = fs.readFileSync(openapiFilePath, 'utf-8');

// TODO XSS protection

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/vehicle', vehicleRoutes);
app.use('/vehicleFuel', vehicleFuelRoutes);
app.use('/fuelLog', fuelLogRoutes);
app.use('/expenseLog', expenseLogRoutes);
app.use('/expenseType', expenseTypeRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(openapiFile)));

app.get('/health', (req, res) => {
    res.send('ok');
});

app.use(hasError);
