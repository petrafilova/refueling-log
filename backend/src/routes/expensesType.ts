import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as expensesTypeController from '../controllers/expensesType';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get(
    '/',
    isAuth,
    expensesTypeController.getAllExpensesTypes
);

router.post(
    '/',
    isAuth,
    [
        body('name').trim().isLength({ max: 30 }).notEmpty().isString(),
    ],
    validationError,
    expensesTypeController.createExpensesType
);

router.put(
    '/:expensesTypeId',
    isAuth,
    [
        param('expensesTypeId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('name').trim().isLength({ max: 30 }).notEmpty().isString(),
    ],
    validationError,
    expensesTypeController.updateExpensesType
);

router.delete(
    '/:expensesTypeId',
    isAuth,
    [param('expensesTypeId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    expensesTypeController.deleteExpensesType
);

export default router;
