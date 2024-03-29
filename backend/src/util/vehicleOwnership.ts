import { Transaction } from 'sequelize';
import CustomError from '../models/customError';
import Vehicle from '../models/database/vehicle';
import VehicleFuel from '../models/database/vehicleFuel';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

/**
 *  @param {string} username - Username
 *  @param {number} vehicleId - ID of vehicle
 *  @param {Transaction=} t - Sequelize transaction
 *  @returns {PromiseLike<void>} - Returns promise which fails if username is not owner of vehicle
 */
export const checkVehicleOwnership = async (
    username: string,
    vehicleId: number,
    t?: Transaction
) => {
    const vehicle = await Vehicle.scope('ownershipScope').findOne({
        where: {
            id: vehicleId,
            username: username,
        },
        transaction: t,
    });
    if (!vehicle) {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
        error.statusCode = 404;
        throw error;
    }
};

/**
 *  @param {string} username - Username
 *  @param {number} vehicleFuelId - ID of vehicle fuel
 *  @param {Transaction=} t - Sequelize transaction
 *  @returns {PromiseLike<void>} - Returns promise which fails if username is not owner of vehicle with specified vehicleFuel
 */
export const checkVehicleFuelOwnership = async (
    username: string,
    vehicleFuelId: number,
    t?: Transaction
) => {
    const vehicleFuel = await VehicleFuel.findOne({
        where: {
            id: vehicleFuelId,
        },
        transaction: t,
    });
    if (!vehicleFuel) {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
        error.statusCode = 404;
        throw error;
    }

    const vehicle = await Vehicle.scope('ownershipScope').findOne({
        where: {
            id: vehicleFuel.vehicleId,
            username: username,
        },
        transaction: t,
    });
    if (!vehicle) {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.NOT_FOUND;
        error.statusCode = 404;
        throw error;
    }
};