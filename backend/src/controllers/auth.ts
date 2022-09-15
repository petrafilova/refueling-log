import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import CustomError from '../models/customError';
import User from '../models/database/user';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';
import { sendMail } from '../util/email';
import sequelize from '../util/database';
import { Op } from 'sequelize';
import decodeAndValidateRefreshToken from '../util/decodeAndValidatRefreshToken';

export const login = (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;

    User.scope('authScope')
        .findOne({
            where: {
                username: username,
                confirmed: true,
            },
        })
        .then(async (user) => {
            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }

            const token = issueToken(user);
            const refreshToken = issueRefreshToken(user);

            res.status(200).json({
                token: token,
                refreshToken: refreshToken,
                username: user.username,
            });
        })
        .catch((err) => {
            next(err);
        });
};

export const refreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const refreshToken = req.body.refreshToken;
    decodeAndValidateRefreshToken(refreshToken)
        .then((username) => {
            User.scope('authScope')
                .findOne({
                    where: {
                        username: username,
                        confirmed: true,
                    },
                })
                .then((user) => {
                    if (!user) {
                        const error = new CustomError();
                        error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                        error.statusCode = 401;
                        throw error;
                    }
                    const token = issueToken(user);
                    const refreshToken = issueRefreshToken(user);
                    res.status(200).json({
                        token: token,
                        refreshToken: refreshToken,
                        username: user.username,
                    });
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err);
        });
};

export const registerAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (process.env.REGISTRATION_ENABLED == 'true') {
            await sequelize.transaction(async (t) => {
                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: {
                            username: req.body.username,
                            email: req.body.email,
                        },
                    },
                    transaction: t,
                });

                if (existingUser) {
                    const error = new CustomError();
                    error.code =
                        req.body.username === existingUser.username
                            ? CUSTOM_ERROR_CODES.UNIQUE_CONSTRAINT_ERROR
                            : CUSTOM_ERROR_CODES.EMAIL_IN_USE;
                    error.statusCode = 409;
                    throw error;
                }

                const userUUID = uuidv4();
                await User.create(
                    { ...req.body, confirmed: false, uuid: userUUID },
                    {
                        fields: [
                            'username',
                            'password',
                            'email',
                            'confirmed',
                            'uuid',
                        ],
                        transaction: t,
                    }
                );
                const confirmUrl =
                    process.env.CONFIRM_URL ?? 'http://localhost:3000/confirm/';
                const emailInfo = await sendMail(
                    req.body.email,
                    'Welcome to Refueling-Log',
                    `Welcome ${req.body.username}, to complete your registration, please confirm your email by copying registration key. Your registration key is "${userUUID}". Please use this key for activating your account.`,
                    `<h1>Welcome ${req.body.username},</h1><p>to complete your registration, please confirm your email by copying registration key. Your registration key is "${userUUID}". Please use this key for activating your account. For better convenience you can follow this <a href="${confirmUrl}${userUUID}">link</a></p>`
                );

                if (emailInfo.rejected.length > 0) {
                    const error = new CustomError();
                    error.code = CUSTOM_ERROR_CODES.UNABLE_TO_SENT_REG_EMAIL;
                    error.statusCode = 503;
                    throw error;
                }
            });
            res.status(201).send();
        } else {
            const error = new CustomError();
            error.code = CUSTOM_ERROR_CODES.UNABLE_TO_SENT_REG_EMAIL;
            error.statusCode = 503;
            throw error;
        }
    } catch (err) {
        next(err);
    }
};

export const confirmAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await sequelize.transaction(async (t) => {
            const user = await User.scope('authScope').findOne({
                where: {
                    uuid: req.params.uuid,
                },
                transaction: t,
            });

            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.ACCOUNT_DOESNT_EXIST;
                error.statusCode = 401;
                throw error;
            }
            user.confirmed = true;
            user.uuid = null;
            const confirmedUser = await user.save({
                transaction: t,
            });

            const token = issueToken(confirmedUser);
            const refreshToken = issueRefreshToken(confirmedUser);

            return {
                token: token,
                refreshToken: refreshToken,
                username: confirmedUser.username,
            };
        });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const usernameFromToken = req.username;
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;

    try {
        if (usernameFromToken != username) {
            const error = new CustomError();
            error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
            throw error;
        }
        await sequelize.transaction(async (t) => {
            const user = await User.scope('authScope').findOne({
                where: {
                    username: username,
                    confirmed: true,
                },
                transaction: t,
            });
            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }

            await user.update(
                {
                    password: newPassword,
                },
                {
                    transaction: t,
                }
            );
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// TODO allow delete user and cascade delete all his data
export const deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const usernameFromToken = req.username;
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (usernameFromToken != username) {
            const error = new CustomError();
            error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
            throw error;
        }
        await sequelize.transaction(async (t) => {
            const user = await User.scope('authScope').findOne({
                where: {
                    username: username,
                    confirmed: true,
                },
                transaction: t,
            });
            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
                error.statusCode = 401;
                throw error;
            }

            await user.destroy({ transaction: t });
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

const issueToken = (user: User) => {
    const token = jwt.sign(
        {
            username: user.username,
        },
        process.env.TOKEN_SIGN_KEY!,
        { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );
    return token;
};

const issueRefreshToken = (user: User) => {
    const refreshToken = jwt.sign(
        {
            username: user.username,
            refresh: true,
        },
        process.env.TOKEN_SIGN_KEY!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    return refreshToken;
};
