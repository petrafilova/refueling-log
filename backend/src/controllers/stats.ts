import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import VehicleFuel from '../models/database/vehicleFuel';
import ExpenseType from '../models/database/expenseType';
import FuelLog from '../models/database/fuelLog';
import MonthStatistics from '../models/database/monthStatistics';
import { DateTime } from 'luxon';
import { checkVehicleOwnership } from '../util/vehicleOwnership';

export const getTotalExpenses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const vehicleId = +req.params.vehicleId;
        await checkVehicleOwnership(req.username!, vehicleId);

        const allVehicleFuels = await VehicleFuel.findAll({
            where: {
                vehicleId: vehicleId,
            },
        });

        const costOfFuelPromises = allVehicleFuels.map((e) =>
            FuelLog.sum('totalPrice', {
                where: {
                    vehicleFuelId: e.id,
                },
            }).then((sum) => {
                return { price: sum ?? 0, fuel: e.fuel };
            })
        );

        const costOfFuel = await Promise.all(costOfFuelPromises);
        const costOfFuelTotal = costOfFuel.reduce((prev, current) => {
            return prev + current.price;
        }, 0);

        const mileage = await FuelLog.findOne({
            where: {
                vehicleFuelId: {
                    [Op.in]: allVehicleFuels.map((e) => e.id),
                },
            },
            order: [['dateTime', 'DESC']],
            limit: 1,
        });

        const expenseTypes = await ExpenseType.findAll();

        const expensesPromises = expenseTypes.map((et) =>
            MonthStatistics.sum('priceSummary', {
                where: {
                    vehicleId: vehicleId,
                    expenseTypeId: et.id,
                },
            }).then((sum) => {
                return { price: sum ?? 0, type: et.name };
            })
        );

        const expenses = await Promise.all(expensesPromises);
        const expensesTotal = expenses.reduce((prev, current) => {
            return prev + current.price;
        }, 0);

        res.status(200).json({
            mileage: mileage?.mileage,
            costOfFuel,
            costOfFuelTotal,
            expenses,
            expensesTotal,
            sum: expensesTotal + costOfFuelTotal,
        });
    } catch (err) {
        next(err);
    }
};

export const getExpenses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const vehicleId = +req.params.vehicleId;
        await checkVehicleOwnership(req.username!, vehicleId);

        const dateFrom = new Date(req.body.dateFrom);
        const dateTo = new Date(req.body.dateTo);

        const expenseTypes = await ExpenseType.findAll();

        const expensesPromises = expenseTypes.map(async (et) => {
            const stat = await MonthStatistics.findAll({
                where: {
                    vehicleId: vehicleId,
                    expenseTypeId: et.id,
                    [Op.or]: [
                        {
                            month: {
                                [Op.gte]: dateFrom.getMonth(),
                            },
                            year: dateFrom.getFullYear(),
                        },
                        {
                            year: {
                                [Op.gt]: dateFrom.getFullYear(),
                                [Op.lt]: dateTo.getFullYear(),
                            },
                        },
                        {
                            month: {
                                [Op.lte]: dateTo.getMonth(),
                            },
                            year: dateTo.getFullYear(),
                        },
                    ],
                },
                order: [
                    ['year', 'DESC'],
                    ['month', 'DESC'],
                ],
            });
            return {
                type: et.name,
                stats: stat.map((s) => {
                    return {
                        price: s.priceSummary,
                        date: s.year + '-' + (s.month + 1),
                    };
                }),
            };
        });

        const expenses = await Promise.all(expensesPromises);

        res.status(200).json(expenses);
    } catch (err) {
        next(err);
    }
};

export const getFuel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const vehicleId = +req.params.vehicleId;
        const vehicleFuelId = +req.body.vehicleFuelId;

        await checkVehicleOwnership(req.username!, vehicleId);

        const dateFrom = DateTime.fromISO(req.body.dateFrom);
        let dateTo = DateTime.fromISO(req.body.dateTo);
        dateTo = dateTo.set({ day: dateTo.daysInMonth });

        let vehicleFuels = await VehicleFuel.findAll({
            where: {
                vehicleId: vehicleId,
            },
            attributes: ['id', 'fuel'],
            order: [['fuel', 'ASC']],
        });

        if (vehicleFuelId) {
            // just to make sure that vehicleFuelId is from this vehicle with vehicleId
            vehicleFuels = vehicleFuels.filter((vf) => vf.id === vehicleFuelId);
        }

        const fuelStatsPromises = vehicleFuels.map(async (vf) => {
            const stat = await FuelLog.findAll({
                where: {
                    dateTime: {
                        [Op.gte]: dateFrom.toJSDate(),
                        [Op.lte]: dateTo.toJSDate(),
                    },
                    vehicleFuelId: vf.id,
                },
                order: [['dateTime', 'ASC']],
            });

            return {
                type: vf.fuel,
                stats: stat.map((fuelLog) => {
                    return {
                        dateTime: fuelLog.dateTime,
                        unitPrice: fuelLog.unitPrice,
                    };
                }),
            };
        });

        const fuelStats = await Promise.all(fuelStatsPromises);

        res.status(200).json(fuelStats);
    } catch (err) {
        next(err);
    }
};

export const getConsumption = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const vehicleId = +req.params.vehicleId;
        await checkVehicleOwnership(req.username!, vehicleId);

        const vehicleFuelId = +req.body.vehicleFuelId;
        const dateFrom = DateTime.fromISO(req.body.dateFrom);
        let dateTo = DateTime.fromISO(req.body.dateTo);
        dateTo = dateTo.set({ day: dateTo.daysInMonth });

        let vehicleFuels = await VehicleFuel.findAll({
            where: {
                vehicleId: vehicleId,
            },
            attributes: ['id', 'fuel'],
            order: [['fuel', 'ASC']],
        });

        if (vehicleFuelId) {
            // just to make sure that vehicleFuelId is from this vehicle with vehicleId
            vehicleFuels = vehicleFuels.filter((vf) => vf.id === vehicleFuelId);
        }

        const consumptionStatsPromises = vehicleFuels.map(async (vf) => {
            const stat = await FuelLog.findAll({
                where: {
                    dateTime: {
                        [Op.gte]: dateFrom.toJSDate(),
                        [Op.lte]: dateTo.toJSDate(),
                    },
                    vehicleFuelId: vf.id,
                    consumption: {
                        [Op.not]: null,
                    },
                },
                order: [['dateTime', 'ASC']],
            });

            return {
                type: vf.fuel,
                stats: stat.map((fuelLog) => {
                    return {
                        dateTime: fuelLog.dateTime,
                        consumption: fuelLog.consumption,
                    };
                }),
            };
        });

        const consumptionStats = await Promise.all(consumptionStatsPromises);

        res.status(200).json(consumptionStats);
    } catch (err) {
        next(err);
    }
};
