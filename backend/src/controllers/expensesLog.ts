import { NextFunction, Request, Response } from 'express';

import sequelize from '../util/database';
import ExpensesLog from '../models/database/expenseLog';
import MonthStatistics from '../models/database/monthStatistics';
import CustomError from '../models/customError';
import { Transaction } from 'sequelize';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import { checkVehicleOwnership } from '../util/vehicleOwnership';
import ExpenseType from '../models/database/expenseType';

export const getByVehicle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const limit = +req.body.pageSize;
    const offset = +req.body.pageSize * +req.body.page;
    const vehicleId = +req.params.vehicleId;
    const typeId = +req.body.typeId;

    checkVehicleOwnership(req.username!, vehicleId)
        .then(() => {
            const where: {
                vehicleId: number;
                typeId?: number;
            } = {
                vehicleId: vehicleId,
            };

            if (typeId) {
                where.typeId = typeId;
            }

            return ExpensesLog.findAndCountAll({
                where: where,
                attributes: ['id', 'typeId', 'price', 'dateTime'],
                limit: limit,
                offset: offset,
                order: [['dateTime', req.body.order]],
            });
        })
        .then((expensesLogs) => {
            res.status(200).json({
                page: +req.body.page,
                pageSize: +req.body.pageSize,
                rows: expensesLogs.rows,
                count: expensesLogs.count,
            });
        })
        .catch((err) => {
            next(err);
        });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
    const expensesLogId = +req.params.expensesLogId;
    ExpensesLog.findByPk(expensesLogId)
        .then(async (expensesLog) => {
            if (!expensesLog) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(req.username!, expensesLog.vehicleId);

            res.status(200).json(expensesLog);
        })
        .catch((err) => {
            next(err);
        });
};

export const createExpensesLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vehicleId = +req.body.vehicleId;
    const typeId = +req.body.typeId;
    const price = +req.body.price;
    try {
        const expensesLog = await sequelize.transaction(async (t) => {
            await checkVehicleOwnership(req.username!, vehicleId, t);
            const expenseType = await ExpenseType.findByPk(typeId, {
                transaction: t,
            });
            if (!expenseType || expenseType.username !== req.username) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }
            const expensesLog = await ExpensesLog.create(req.body, {
                fields: [
                    'price',
                    'mileage',
                    'dateTime',
                    'comment',
                    'typeId',
                    'vehicleId',
                ],
                transaction: t,
            });

            const dateTime = new Date(req.body.dateTime);
            const month = dateTime.getMonth();
            const year = dateTime.getFullYear();

            await updateStats(month, year, vehicleId, typeId, price, t);
            return expensesLog;
        });
        res.status(201).json(expensesLog);
    } catch (err) {
        next(err);
    }
};

export const updateExpensesLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const expensesLogId = +req.params.expensesLogId;
    const vehicleId = +req.body.vehicleId;
    const typeId = +req.body.typeId;
    const price = +req.body.price;
    try {
        const expensesLog = await sequelize.transaction(async (t) => {
            let expensesLog = await ExpensesLog.findByPk(expensesLogId, {
                transaction: t,
            });
            const expenseType = await ExpenseType.findByPk(typeId, {
                transaction: t,
            });
            if (
                !expensesLog ||
                !expenseType ||
                expenseType.username !== req.username
            ) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(
                req.username!,
                expensesLog.vehicleId,
                t
            );
            await checkVehicleOwnership(req.username!, vehicleId, t);

            // it is not always needed to update price but this approach simplifies whole process with just low resource costs
            const origDateTime = expensesLog.dateTime;
            const origMonth = origDateTime.getMonth();
            const origYear = origDateTime.getFullYear();
            await updateStats(
                origMonth,
                origYear,
                expensesLog.vehicleId,
                expensesLog.typeId,
                0 - expensesLog.price, // subtract original amount
                t
            );

            const newDateTime = new Date(req.body.dateTime);
            const newMonth = newDateTime.getMonth();
            const newYear = newDateTime.getFullYear();
            await updateStats(
                newMonth,
                newYear,
                vehicleId,
                typeId,
                price, // add new amount
                t
            );

            expensesLog = await expensesLog.update(req.body, {
                fields: [
                    'price',
                    'mileage',
                    'dateTime',
                    'comment',
                    'typeId',
                    'vehicleId',
                ],
                transaction: t,
            });
            return expensesLog;
        });
        res.status(200).json(expensesLog);
    } catch (err) {
        next(err);
    }
};

export const deleteExpensesLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const expensesLogId = +req.params.expensesLogId;

    try {
        await sequelize.transaction(async (t) => {
            const expensesLog = await ExpensesLog.findByPk(expensesLogId, {
                transaction: t,
            });

            if (!expensesLog) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(
                req.username!,
                expensesLog.vehicleId,
                t
            );

            const origDateTime = expensesLog.dateTime;
            const origMonth = origDateTime.getMonth();
            const origYear = origDateTime.getFullYear();
            await updateStats(
                origMonth,
                origYear,
                expensesLog.vehicleId,
                expensesLog.typeId,
                0 - expensesLog.price, // subtract original amount
                t
            );

            await ExpensesLog.destroy({
                where: {
                    id: expensesLogId,
                },
                transaction: t,
            });
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const updateStats = async (
    month: number,
    year: number,
    vehicleId: number,
    expenseTypeId: number,
    price: number,
    t: Transaction
): Promise<MonthStatistics> => {
    const stats = await MonthStatistics.findOne({
        where: {
            month: month,
            year: year,
            vehicleId: vehicleId,
            expenseTypeId: expenseTypeId,
        },
        limit: 1,
        transaction: t,
    });

    if (stats) {
        stats.priceSummary = +stats.priceSummary + price;
        return stats.save({ transaction: t });
    } else {
        return MonthStatistics.create(
            {
                month: month,
                year: year,
                vehicleId: vehicleId,
                expenseTypeId: expenseTypeId,
                priceSummary: price,
            },
            {
                transaction: t,
            }
        );
    }
};
