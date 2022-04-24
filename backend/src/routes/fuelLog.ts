import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as fuelLogController from '../controllers/fuelLog';
import isAuth from '../middleware/is-auth';
import { ALL_SORTS, SORT_ORDER } from '../models/sortOrderEnum';

const router = express.Router();

router.post(
    '/byVehicleFuel/:vehicleFuelId',
    isAuth,
    [
        param('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('page').default(0).isInt({ min: 0, allow_leading_zeroes: false }),
        body('pageSize').default(10).isInt({ min: 1, allow_leading_zeroes: false }),
        body('order').default(SORT_ORDER.DESC).isIn(ALL_SORTS),
    ],
    validationError,
    fuelLogController.getByVehicleFuel
);

router.get(
    '/:fuelLogId',
    isAuth,
    [param('fuelLogId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    fuelLogController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('quantity').isFloat({min: 0}),
        body('unitPrice').isFloat({min: 0}),
        body('totalPrice').isFloat({min: 0}),
        body('mileage').isFloat({min: 0}),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('full').isBoolean(),
        body('previousMissing').isBoolean(),
        body('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    fuelLogController.createFuelLog
);

router.put(
    '/:fuelLogId',
    isAuth,
    [
        param('fuelLogId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('quantity').isFloat({min: 0}),
        body('unitPrice').isFloat({min: 0}),
        body('totalPrice').isFloat({min: 0}),
        body('mileage').isFloat({min: 0}),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('full').isBoolean(),
        body('previousMissing').isBoolean(),
        body('vehicleFuelId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    fuelLogController.updateFuelLog
);

router.delete(
    '/:fuelLogId',
    isAuth,
    [param('fuelLogId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    fuelLogController.deleteFuelLog
);

export default router;
