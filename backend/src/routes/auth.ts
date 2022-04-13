import express from 'express';
import { body, param } from 'express-validator';

import validationError from '../middleware/validationError';
import * as authController from '../controllers/auth';
import isRefresh from '../middleware/is-refresh';
import isAuth from '../middleware/is-auth';

const router = express.Router();

router.post(
    '/login',
    [
        body('username')
            .trim()
            .escape()
            .isLength({ max: 50 })
            .notEmpty()
            .isString(),
        body('password')
            .trim()
            .escape()
            .isLength({ max: 250 })
            .notEmpty()
            .isString(),
    ],
    validationError,
    authController.login
);

router.post('/refresh', isRefresh, authController.refreshToken);

router.post(
    '/register',
    [
        body('username')
            .trim()
            .escape()
            .isLength({ min: 4, max: 50 })
            .isString(),
        body('password')
            .trim()
            .escape()
            .isLength({ min: 8, max: 250 })
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            })
            .isString(),
        body('email').trim().escape().isLength({ max: 320 }).isEmail(),
    ],
    validationError,
    authController.registerAccount
);

router.post(
    '/confirm/:uuid',
    [param('uuid').trim().escape().isUUID('4')],
    validationError,
    authController.confirmAccount
);

router.put(
    '/password',
    isAuth,
    [
        body('username')
            .trim()
            .escape()
            .isLength({ max: 50 })
            .notEmpty()
            .isString(),
        body('password')
            .trim()
            .escape()
            .isLength({ max: 250 })
            .notEmpty()
            .isString(),
        body('newPassword')
            .trim()
            .escape()
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
    '/delete',
    isAuth,
    [
        body('username')
            .trim()
            .escape()
            .isLength({ max: 50 })
            .notEmpty()
            .isString(),
        body('password')
            .trim()
            .escape()
            .isLength({ max: 250 })
            .notEmpty()
            .isString(),
    ],
    validationError,
    authController.deleteAccount
);

export default router;
