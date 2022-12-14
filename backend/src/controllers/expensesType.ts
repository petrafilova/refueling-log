import { NextFunction, Request, Response } from 'express';

import ExpensesType from '../models/database/expenseType';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import sequelize from '../util/database';

export const getAllExpensesTypes = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    ExpensesType.findAll({
        where: {
            username: req.username,
        },
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    })
        .then((expensesTypes) => {
            res.status(200).json(expensesTypes);
        })
        .catch((err) => {
            next(err);
        });
};

export const createExpensesType = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const expenseType = await ExpensesType.create(
                { ...req.body, username: req.username },
                {
                    fields: ['name', 'username'],
                    transaction: t,
                }
            );

            const result = await ExpensesType.findByPk(expenseType.id, {
                attributes: ['id', 'name'],
                transaction: t,
            });
            return result;
        });
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const updateExpensesType = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const expensesType = await ExpensesType.findOne({
                where: {
                    id: req.params.expensesTypeId,
                    username: req.username,
                },
                attributes: ['id', 'name'],
                transaction: t,
            });

            if (!expensesType) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            const result = await expensesType.update(
                req.body,
                {
                    fields: ['name'],
                },
                {
                    transaction: t,
                }
            );
            return result;
        });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteExpensesType = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sequelize.transaction(async (t) => {
            const result = await ExpensesType.destroy({
                where: {
                    id: req.params.expensesTypeId,
                    username: req.username,
                },
                transaction: t,
            });
            if (result === 0) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
