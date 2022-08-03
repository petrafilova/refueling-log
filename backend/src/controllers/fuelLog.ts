import { NextFunction, Request, Response } from 'express';

import sequelize from '../util/database';
import FuelLog from '../models/database/fuelLog';
import CustomError from '../models/customError';
import { Op, Transaction } from 'sequelize';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import { checkVehicleFuelOwnership } from '../util/vehicleOwnership';

export const getByVehicleFuel = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const limit = +req.body.pageSize;
    const offset = +req.body.pageSize * req.body.page;
    const vehicleFuelId = +req.params.vehicleFuelId;

    checkVehicleFuelOwnership(req.username!, vehicleFuelId)
        .then(() => {
            return FuelLog.findAll({
                where: {
                    vehicleFuelId: vehicleFuelId,
                },
                attributes: ['id', 'quantity', 'totalPrice', 'dateTime'],
                limit: limit,
                offset: offset,
                order: [['dateTime', req.body.order]],
            });
        })
        .then((fuelLogs) => {
            res.status(200).json(fuelLogs);
        })
        .catch((err) => {
            next(err);
        });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
    const fuelLogId = +req.params.fuelLogId;
    FuelLog.findByPk(fuelLogId)
        .then(async (fuelLog) => {
            if (!fuelLog) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleFuelOwnership(
                req.username!,
                fuelLog.vehicleFuelId
            );

            res.status(200).json(fuelLog);
        })
        .catch((err) => {
            next(err);
        });
};

export const createFuelLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vehicleFuelId = +req.body.vehicleFuelId;
    const t = await sequelize.transaction();
    try {
        await checkVehicleFuelOwnership(req.username!, vehicleFuelId, t);

        const fuelLog = await FuelLog.create(req.body, {
            fields: [
                'quantity',
                'unitPrice',
                'totalPrice',
                'mileage',
                'dateTime',
                'full',
                'previousMissing',
                'vehicleFuelId',
            ],
            transaction: t,
        });

        const result = await updateconsumptionOfFuelLog(fuelLog, t); // update actual fuel log
        const nextFull = await findNextFullLog(
            fuelLog.vehicleFuelId,
            fuelLog.dateTime,
            t
        ); // find next full fuel log
        if (nextFull) {
            await updateconsumptionOfFuelLog(nextFull, t); // update next full fuel log
        }
        await t.commit();
        res.status(201).json(result);
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

export const updateFuelLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fuelLogId = +req.params.fuelLogId;
    const vehicleFuelId = +req.body.vehicleFuelId;
    const dateTime = new Date(req.body.dateTime);
    try {
        await sequelize.transaction(async (t) => {
            let fuelLog = await FuelLog.findByPk(fuelLogId);

            if (!fuelLog) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleFuelOwnership(
                req.username!,
                fuelLog.vehicleFuelId,
                t
            );
            await checkVehicleFuelOwnership(req.username!, vehicleFuelId, t);

            const originVehicleFuelId = +fuelLog.vehicleFuelId;
            const originDateTime = fuelLog.dateTime;

            fuelLog = await fuelLog.update(req.body, {
                fields: [
                    'quantity',
                    'unitPrice',
                    'totalPrice',
                    'mileage',
                    'dateTime',
                    'full',
                    'previousMissing',
                    'vehicleFuelId',
                ],
                transaction: t,
            });

            const result = await updateconsumptionOfFuelLog(fuelLog, t);
            const nextFull = await findNextFullLog(
                fuelLog.vehicleFuelId,
                fuelLog.dateTime,
                t
            ); // find next full fuel log
            if (nextFull) {
                await updateconsumptionOfFuelLog(nextFull, t); // update next full fuel log
            }

            if (
                vehicleFuelId !== originVehicleFuelId ||
                dateTime.getTime() !== originDateTime.getTime()
            ) {
                const nextFullOrigin = await findNextFullLog(
                    originVehicleFuelId,
                    originDateTime,
                    t
                );
                if (nextFullOrigin) {
                    await updateconsumptionOfFuelLog(nextFullOrigin, t); // update next full fuel log
                }
            }
            res.status(200).json(result);
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const deleteFuelLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const fuelLogId = +req.params.fuelLogId;
    try {
        await sequelize.transaction(async (t) => {
            const fuelLog = await FuelLog.findByPk(fuelLogId);
            if (!fuelLog) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleFuelOwnership(
                req.username!,
                fuelLog.vehicleFuelId,
                t
            );

            await FuelLog.destroy({
                where: {
                    id: fuelLogId,
                },
                transaction: t,
            });

            const nextFullLog = await findNextFullLog(
                fuelLog.vehicleFuelId,
                fuelLog.dateTime,
                t
            );
            if (nextFullLog) {
                await updateconsumptionOfFuelLog(nextFullLog, t); // update next full fuel log
            }
            res.status(204).send();
        });
    } catch (err) {
        next(err);
    }
};

const updateconsumptionOfFuelLog = async (
    fuelLog: FuelLog,
    t: Transaction
): Promise<FuelLog> => {
    if (fuelLog.full && fuelLog.previousMissing === false) {
        const prevFuelLog = await findPreviousFullLog(
            fuelLog.vehicleFuelId,
            fuelLog.dateTime,
            t
        );
        if (prevFuelLog) {
            const allBetween = await findAllBetween(
                fuelLog.vehicleFuelId,
                prevFuelLog.dateTime,
                fuelLog.dateTime,
                t
            );
            const hasMissing =
                allBetween.filter((fl) => fl.previousMissing === true).length >
                0;
            if (!hasMissing) {
                const mileageDiff = +fuelLog.mileage - +prevFuelLog.mileage;
                const consumption = countConsumption(
                    allBetween,
                    +fuelLog.quantity,
                    mileageDiff
                );
                fuelLog.consumption = consumption;
            } else {
                fuelLog.consumption = null;
            }
        } else {
            fuelLog.consumption = null;
        }
    } else {
        fuelLog.consumption = null;
    }

    return fuelLog.save({ transaction: t });
};

const findPreviousFullLog = (
    vehicleFuelId: number,
    dateTime: Date,
    t: Transaction
): Promise<FuelLog | null> => {
    return FuelLog.findOne({
        where: {
            dateTime: {
                [Op.lt]: dateTime,
            },
            full: {
                [Op.eq]: true,
            },
            vehicleFuelId: vehicleFuelId,
        },
        order: [['dateTime', 'DESC']],
        limit: 1,
        transaction: t,
    });
};

const findNextFullLog = (
    vehicleFuelId: number,
    dateTime: Date,
    t: Transaction
): Promise<FuelLog | null> => {
    return FuelLog.findOne({
        where: {
            dateTime: {
                [Op.gt]: dateTime,
            },
            full: {
                [Op.eq]: true,
            },
            vehicleFuelId: vehicleFuelId,
        },
        order: [['dateTime', 'ASC']],
        limit: 1,
        transaction: t,
    });
};

const findAllBetween = (
    vehicleFuelId: number,
    dateFrom: Date,
    dateTo: Date,
    t: Transaction
): Promise<FuelLog[]> => {
    return FuelLog.findAll({
        where: {
            dateTime: {
                [Op.gt]: dateFrom,
                [Op.lt]: dateTo,
            },
            vehicleFuelId: vehicleFuelId,
        },
        order: [['dateTime', 'DESC']],
        transaction: t,
    });
};

const countConsumption = (
    fuelLogs: FuelLog[],
    quantityToAdd: number,
    mileageDiff: number
): number => {
    const fuelSum =
        fuelLogs.reduce((prev, current) => prev + +current.quantity, 0) +
        quantityToAdd;
    return (fuelSum / mileageDiff) * 100;
};
