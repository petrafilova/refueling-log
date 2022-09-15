import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as vehicleFuelController from '../controllers/vehicleFuel';
import isAuth from '../middleware/is-auth';
import { FUEL_TYPE } from '../models/fuelTypeEnum';

const router = express.Router();

router.get(
    '/byVehicle/:vehicleId',
    isAuth,
    [param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    vehicleFuelController.getByVehicle
);

router.get(
    '/:vehicleFuelId',
    isAuth,
    [param('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    vehicleFuelController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('fuel').isIn(Object.keys(FUEL_TYPE)),
        body('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    vehicleFuelController.createVehicleFuel
);

router.put(
    '/:vehicleFuelId',
    isAuth,
    [
        param('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('fuel').isIn(Object.keys(FUEL_TYPE)),
        body('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    vehicleFuelController.updateVehicleFuel
);

router.delete(
    '/:vehicleFuelId',
    isAuth,
    [param('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    vehicleFuelController.deleteVehicleFuel
);

export default router;
