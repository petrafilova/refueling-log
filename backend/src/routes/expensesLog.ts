import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as expensesLogController from '../controllers/expensesLog';
import isAuth from '../middleware/is-auth';
import { ALL_SORTS, SORT_ORDER } from '../models/sortOrderEnum';

const router = express.Router();

router.post(
    '/byVehicle/:vehicleId',
    isAuth,
    [
        param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('page').default(0).isInt({ min: 0, allow_leading_zeroes: false }),
        body('pageSize').default(10).isInt({ min: 1, allow_leading_zeroes: false }),
        body('order').default(SORT_ORDER.DESC).isIn(ALL_SORTS),
        body('typeId').optional({ nullable: true }).isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    expensesLogController.getByVehicle
);

router.get(
    '/:expensesLogId',
    isAuth,
    [param('expensesLogId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    expensesLogController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('price').isFloat({min: 0}),
        body('mileage').isFloat({min: 0}),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('comment').optional({ nullable: true }).trim().isString(),
        body('typeId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    expensesLogController.createExpensesLog
);

router.put(
    '/:expensesLogId',
    isAuth,
    [
        param('expensesLogId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('price').isFloat({min: 0}),
        body('mileage').isFloat({min: 0}),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('comment').optional({ nullable: true }).trim().isString(),
        body('typeId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
    ],
    validationError,
    expensesLogController.updateExpensesLog
);

router.delete(
    '/:expensesLogId',
    isAuth,
    [param('expensesLogId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    expensesLogController.deleteExpensesLog
);

export default router;
