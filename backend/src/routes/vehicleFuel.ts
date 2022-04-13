import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as vehicleFuelController from '../controllers/vehicleFuel';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get(
    '/byVehicle/:vehicleId',
    isAuth,
    [param('vehicleId').isInt()],
    validationError,
    vehicleFuelController.getByVehicle
);

router.get(
    '/:vehicleFuelId',
    isAuth,
    [param('vehicleFuelId').isInt()],
    validationError,
    vehicleFuelController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('fuel').isIn([
            'GASOLINE',
            'DIESEL',
            'LPG',
            'CNG',
            'HYDROGEN',
            'ELECTRICITY',
        ]),
        body('vehicleId').isInt(),
    ],
    validationError,
    vehicleFuelController.createVehicleFuel
);

router.put(
    '/:vehicleFuelId',
    isAuth,
    [
        param('vehicleFuelId').isInt(),
        body('fuel').isIn([
            'GASOLINE',
            'DIESEL',
            'LPG',
            'CNG',
            'HYDROGEN',
            'ELECTRICITY',
        ]),
        body('vehicleId').isInt(),
    ],
    validationError,
    vehicleFuelController.updateVehicleFuel
);

router.delete(
    '/:vehicleFuelId',
    isAuth,
    [param('vehicleFuelId').isInt()],
    validationError,
    vehicleFuelController.deleteVehicleFuel
);

export default router;
