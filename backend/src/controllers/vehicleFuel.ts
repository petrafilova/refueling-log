import { NextFunction, Request, Response } from 'express';

import VehicleFuel from '../models/database/vehicleFuel';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import { checkVehicleOwnership } from '../util/vehicleOwnership';
import sequelize from '../util/database';

export const getByVehicle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    checkVehicleOwnership(req.username!, +req.params.vehicleId)
        .then(() => {
            return VehicleFuel.findAll({
                where: {
                    vehicleId: req.params.vehicleId,
                },
                attributes: ['id', 'fuel'],
                order: [['fuel', 'ASC']],
            });
        })
        .then((vehicleFuels) => {
            res.status(200).json(vehicleFuels);
        })
        .catch((err) => {
            next(err);
        });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
    VehicleFuel.findByPk(req.params.vehicleFuelId)
        .then(async (vehicleFuel) => {
            if (!vehicleFuel) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(req.username!, vehicleFuel.vehicleId);

            res.status(200).json(vehicleFuel);
        })
        .catch((err) => {
            next(err);
        });
};

export const createVehicleFuel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const vehicleFuel = await sequelize.transaction(async (t) => {
            await checkVehicleOwnership(req.username!, +req.body.vehicleId, t);
            const vehicleFuel = await VehicleFuel.create(req.body, {
                fields: ['fuel', 'vehicleId'],
                transaction: t,
            });
            return vehicleFuel;
        });
        res.status(201).json(vehicleFuel);
    } catch (err) {
        next(err);
    }
};

export const updateVehicleFuel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vehicleFuelId = req.params.vehicleFuelId;
    try {
        const vehicleFuel = await sequelize.transaction(async (t) => {
            const vehicleFuel = await VehicleFuel.findByPk(vehicleFuelId, {
                transaction: t,
            });
            if (!vehicleFuel) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(
                req.username!,
                vehicleFuel.vehicleId,
                t
            );
            await checkVehicleOwnership(req.username!, +req.body.vehicleId, t);

            const result = await vehicleFuel.update(req.body, {
                fields: ['fuel', 'vehicleId'],
                transaction: t,
            });

            return result;
        });
        res.status(200).json(vehicleFuel);
    } catch (err) {
        next(err);
    }
};

export const deleteVehicleFuel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sequelize.transaction(async (t) => {
            const vehicleFuel = await VehicleFuel.findByPk(
                req.params.vehicleFuelId,
                { transaction: t }
            );
            if (!vehicleFuel) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(
                req.username!,
                vehicleFuel.vehicleId,
                t
            );
            await vehicleFuel.destroy({ transaction: t });
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
