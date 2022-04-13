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
        body('name').trim().escape().isLength({ max: 30 }).notEmpty().isString(),
    ],
    validationError,
    expensesTypeController.createExpensesType
);

router.put(
    '/:expensesTypeId',
    isAuth,
    [
        param('expensesTypeId').isInt(),
        body('name').trim().escape().isLength({ max: 30 }).notEmpty().isString(),
    ],
    validationError,
    expensesTypeController.updateExpensesType
);

router.delete(
    '/:expensesTypeId',
    isAuth,
    [param('expensesTypeId').isInt()],
    validationError,
    expensesTypeController.deleteExpensesType
);

export default router;
