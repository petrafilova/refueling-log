import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as statsController from '../controllers/stats';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.post(
    '/:vehicleId/total',
    isAuth,
    [param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false })],
    validationError,
    statsController.getTotalExpenses
);

router.post(
    '/:vehicleId/expenses',
    isAuth,
    [
        param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('dateFrom')
            .default(new Date().getFullYear() - 1 + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
        body('dateTo')
            .default(new Date().getFullYear() + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
    ],
    validationError,
    statsController.getExpenses
);

router.post(
    '/:vehicleId/fuel',
    isAuth,
    [
        param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('vehicleFuelId').optional({ nullable: true }).isInt({ min: 1, allow_leading_zeroes: false }),
        body('dateFrom')
            .default(new Date().getFullYear() - 1 + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
        body('dateTo')
            .default(new Date().getFullYear() + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
    ],
    validationError,
    statsController.getFuel
);

router.post(
    '/:vehicleId/consumption',
    isAuth,
    [
        param('vehicleId').isInt({ min: 1, allow_leading_zeroes: false }),
        body('vehicleFuelId').optional({ nullable: true }).isInt({ min: 1, allow_leading_zeroes: false }),
        body('dateFrom')
            .default(new Date().getFullYear() - 1 + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
        body('dateTo')
            .default(new Date().getFullYear() + '-' + new Date().getMonth())
            .custom((value) => {
                const parsed = Date.parse(value);
                if (isNaN(parsed)) {
                    return false;
                }
                const splitted = (value as string).split('-');
                if (splitted.length !== 2) {
                    return false;
                }
                const year = parseInt(splitted[0]);
                const month = parseInt(splitted[1]);
                const parsedDate = new Date(parsed);
                if (
                    year === parsedDate.getFullYear() &&
                    month === parsedDate.getMonth() + 1
                ) {
                    return true;
                }
                return false;
            }),
    ],
    validationError,
    statsController.getConsumption
);

export default router;
