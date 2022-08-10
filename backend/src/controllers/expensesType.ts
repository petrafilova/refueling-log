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
    const t = await sequelize.transaction();
    try {
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
        await t.commit();
        res.status(201).json(result);
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

export const updateExpensesType = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const t = await sequelize.transaction();
    try {
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

        await t.commit();
        res.status(200).json(result);
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

// TODO check if don't allow delete if in use
export const deleteExpensesType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    ExpensesType.destroy({
        where: {
            id: req.params.expensesTypeId,
            username: req.username,
        },
    })
        .then((result) => {
            if (result > 0) {
                res.status(204).send();
            } else {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }
        })
        .catch((err) => {
            next(err);
        });
};
