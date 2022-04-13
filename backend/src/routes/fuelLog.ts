import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as fuelLogController from '../controllers/fuelLog';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.post(
    '/byVehicleFuel/:vehicleFuelId',
    isAuth,
    [
        param('vehicleFuelId').isInt(),
        body('page').default(0).isInt(),
        body('pageSize').default(10).isInt(),
        body('order').default('DESC').isIn(['DESC', 'ASC']),
    ],
    validationError,
    fuelLogController.getByVehicleFuel
);

router.get(
    '/:fuelLogId',
    isAuth,
    [param('fuelLogId').isInt()],
    validationError,
    fuelLogController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('quantity').isDecimal(),
        body('unitPrice').isDecimal(),
        body('totalPrice').isDecimal(),
        body('mileage').isDecimal(),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('full').isBoolean(),
        body('previousMissing').isBoolean(),
        body('vehicleFuelId').isInt(),
    ],
    validationError,
    fuelLogController.createFuelLog
);

router.put(
    '/:fuelLogId',
    isAuth,
    [
        param('fuelLogId').isInt(),
        body('quantity').isDecimal(),
        body('unitPrice').isDecimal(),
        body('totalPrice').isDecimal(),
        body('mileage').isDecimal(),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('full').isBoolean(),
        body('previousMissing').isBoolean(),
        body('vehicleFuelId').isInt(),
    ],
    validationError,
    fuelLogController.updateFuelLog
);

router.delete(
    '/:fuelLogId',
    isAuth,
    [param('fuelLogId').isInt()],
    validationError,
    fuelLogController.deleteFuelLog
);

export default router;
