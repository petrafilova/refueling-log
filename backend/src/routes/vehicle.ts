import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as vehicleController from '../controllers/vehicle';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.get('/', isAuth, vehicleController.getAll);

router.get(
    '/:vehicleId',
    isAuth,
    [param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    vehicleController.getById
);

router.post(
    '/',
    isAuth,
    [
        body('brand')
            .trim()
            .escape()
            .isLength({ max: 20 })
            .notEmpty()
            .isString(),
        body('model')
            .trim()
            .escape()
            .isLength({ max: 60 })
            .notEmpty()
            .isString(),
        body('licensePlateNo')
            .trim()
            .escape()
            .isLength({ max: 10 })
            .notEmpty()
            .isString(),
        body('dateOfReg').optional({ nullable: true }).isDate(),
        body('color')
            .optional({ nullable: true })
            .trim()
            .escape()
            .isLength({ max: 20 })
            .isString(),
        body('vin')
            .optional({ nullable: true })
            .trim()
            .escape()
            .isLength({ max: 17 })
            .isString(),
    ],
    validationError,
    vehicleController.createVehicle
);

router.put(
    '/:vehicleId',
    isAuth,
    [
        param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('brand')
            .trim()
            .escape()
            .isLength({ max: 20 })
            .notEmpty()
            .isString(),
        body('model')
            .trim()
            .escape()
            .isLength({ max: 60 })
            .notEmpty()
            .isString(),
        body('licensePlateNo')
            .trim()
            .escape()
            .isLength({ max: 10 })
            .notEmpty()
            .isString(),
        body('dateOfReg').optional({ nullable: true }).isDate(),
        body('color')
            .optional({ nullable: true })
            .trim()
            .escape()
            .isLength({ max: 20 })
            .isString(),
        body('vin')
            .optional({ nullable: true })
            .trim()
            .escape()
            .isLength({ max: 17 })
            .isString(),
    ],
    validationError,
    vehicleController.updateVehicle
);

router.delete(
    '/:vehicleId',
    isAuth,
    [param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    vehicleController.deleteVehicle
);

export default router;
