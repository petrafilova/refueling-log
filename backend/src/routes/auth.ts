import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as authController from '../controllers/auth';
import isAuth from '../middleware/is-auth';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const refreshLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const registerAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 4,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const confirmAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const requestResetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.TOO_MANY_REQUESTS;
        error.statusCode = 429;
        next(error);
    },
});

const router = express.Router();

router.post(
    '/login',
    loginLimiter,
    [
        body('username').trim().isLength({ max: 50 }).notEmpty().isString(),
        body('password').trim().isLength({ max: 250 }).notEmpty().isString(),
    ],
    validationError,
    authController.login
);

router.post(
    '/refresh',
    refreshLimiter,
    [body('refreshToken').trim().isJWT()],
    authController.refreshToken
);

router.post(
    '/register',
    registerAccountLimiter,
    [
        body('username').trim().isLength({ min: 4, max: 50 }).isString(),
        body('password')
            .trim()
            .isLength({ min: 8, max: 250 })
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            })
            .isString(),
        body('email').trim().isLength({ max: 320 }).isEmail(),
    ],
    validationError,
    authController.registerAccount
);

router.post(
    '/confirm/:uuid',
    confirmAccountLimiter,
    [param('uuid').trim().isUUID('4').notEmpty()],
    validationError,
    authController.confirmAccount
);

router.put(
    '/password',
    isAuth,
    [
        body('username').trim().isLength({ max: 50 }).notEmpty().isString(),
        body('password').trim().isLength({ max: 250 }).notEmpty().isString(),
        body('newPassword')
            .trim()
            .isLength({ max: 250 })
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            })
            .isString(),
    ],
    validationError,
    authController.updatePassword
);

router.post(
    '/reset',
    requestResetPasswordLimiter,
    [body('email').trim().isLength({ max: 320 }).isEmail()],
    validationError,
    authController.resetPasswordLink
);

router.patch(
    '/reset',
    resetPasswordLimiter,
    [
        body('uuid').trim().isUUID('4').notEmpty(),
        body('username').trim().isLength({ max: 50 }).notEmpty().isString(),
        body('newPassword')
            .trim()
            .isLength({ max: 250 })
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            })
            .isString(),
    ],
    validationError,
    authController.resetPassword
);

router.post(
    '/delete',
    isAuth,
    [
        body('username').trim().isLength({ max: 50 }).notEmpty().isString(),
        body('password').trim().isLength({ max: 250 }).notEmpty().isString(),
    ],
    validationError,
    authController.deleteAccount
);

export default router;
