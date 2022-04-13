import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as expensesLogController from '../controllers/expensesLog';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.post(
    '/byVehicle/:vehicleId',
    isAuth,
    [
        param('vehicleId').isInt(),
        body('page').default(0).isInt(),
        body('pageSize').default(10).isInt(),
        body('order').default('DESC').isIn(['DESC', 'ASC']),
        body('typeId').optional({ nullable: true }).isInt(),
    ],
    validationError,
    expensesLogController.getByVehicle
);

router.get(
    '/:expensesLogId',
    isAuth,
    [param('expensesLogId').isInt()],
    validationError,
    expensesLogController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('price').isDecimal(),
        body('mileage').isDecimal(),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('comment').optional({ nullable: true }).trim().escape().isString(),
        body('typeId').isInt(),
        body('vehicleId').isInt(),
    ],
    validationError,
    expensesLogController.createExpensesLog
);

router.put(
    '/:expensesLogId',
    isAuth,
    [
        param('expensesLogId').isInt(),
        body('price').isDecimal(),
        body('mileage').isDecimal(),
        body('dateTime').isISO8601({strict: true, strictSeparator: true}),
        body('comment').optional({ nullable: true }).trim().escape().isString(),
        body('typeId').isInt(),
        body('vehicleId').isInt(),
    ],
    validationError,
    expensesLogController.updateExpensesLog
);

router.delete(
    '/:expensesLogId',
    isAuth,
    [param('expensesLogId').isInt()],
    validationError,
    expensesLogController.deleteExpensesLog
);

export default router;
