import { NextFunction, Request, Response } from 'express';

import VehicleFuel from '../models/database/vehicleFuel';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import { checkVehicleOwnership } from '../util/vehicleOwnership';

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
            console.error(err);
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
            console.error(err);
            next(err);
        });
};

export const createVehicleFuel = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    checkVehicleOwnership(req.username!, +req.body.vehicleId)
        .then(() => {
            return VehicleFuel.create(req.body, {
                fields: ['fuel', 'vehicleId'],
            });
        })
        .then((vehicleFuel) => {
            res.status(201).json(vehicleFuel);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
};

export const updateVehicleFuel = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const vehicleFuelId = req.params.vehicleFuelId;
    VehicleFuel.findByPk(vehicleFuelId)
        .then(async (vehicleFuel) => {
            if (!vehicleFuel) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(req.username!, vehicleFuel.vehicleId);
            await checkVehicleOwnership(req.username!, +req.body.vehicleId);

            return vehicleFuel.update(req.body, {
                fields: ['fuel', 'vehicleId'],
            });
        })
        .then((vehicleFuel) => {
            res.status(200).json(vehicleFuel);
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
};

// TODO check if don't allow delete if used
export const deleteVehicleFuel = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    VehicleFuel.findByPk(req.params.vehicleFuelId)
        .then(async (vehicleFuel) => {
            if (!vehicleFuel) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }

            await checkVehicleOwnership(req.username!, vehicleFuel.vehicleId);

            return vehicleFuel.destroy();
        })
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
};
