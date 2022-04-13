import { NextFunction, Request, Response } from 'express';

import Vehicle from '../models/database/vehicle';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import sequelize from '../util/database';

export const getAll = (req: Request, res: Response, next: NextFunction) => {
    Vehicle.findAll({
        where: {
            username: req.username,
        },
        attributes: ['id', 'brand', 'model', 'licensePlateNo'],
        order: [
            ['brand', 'ASC'],
            ['model', 'ASC'],
            ['licensePlateNo', 'ASC'],
        ],
    })
        .then((vehicles) => {
            res.status(200).json(vehicles);
        })
        .catch((err) => {
            next(err);
        });
};

export const getById = (req: Request, res: Response, next: NextFunction) => {
    Vehicle.findOne({
        where: {
            id: req.params.vehicleId,
            username: req.username,
        },
    })
        .then((vehicle) => {
            if (!vehicle) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(vehicle);
        })
        .catch((err) => {
            next(err);
        });
};

export const createVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sequelize.transaction(async (t) => {
            const vehicle = await Vehicle.create(
                { ...req.body, username: req.username },
                {
                    fields: [
                        'brand',
                        'model',
                        'licensePlateNo',
                        'dateOfReg',
                        'color',
                        'vin',
                        'username',
                    ],
                    transaction: t,
                }
            );

            const result = await Vehicle.findByPk(vehicle.id, {
                transaction: t,
            });

            res.status(201).json(result);
        });
    } catch (err) {
        next(err);
    }
};

export const updateVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sequelize.transaction(async (t) => {
            const vehicle = await Vehicle.findOne({
                where: {
                    id: req.params.vehicleId,
                    username: req.username,
                },
                transaction: t,
            });

            if (!vehicle) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
                error.statusCode = 404;
                throw error;
            }
            const result = await vehicle.update(
                req.body,
                {
                    fields: [
                        'brand',
                        'model',
                        'licensePlateNo',
                        'dateOfReg',
                        'color',
                        'vin',
                    ],
                },
                { transaction: t }
            );

            res.status(200).json(result);
        });
    } catch (err) {
        next(err);
    }
};

export const deleteVehicle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Vehicle.destroy({
        where: {
            id: req.params.vehicleId,
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
