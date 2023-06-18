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
import moment from 'moment';

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
                    'Registrácia',
                    `Vitajte ${req.body.username}, na dokončenie registrácie prosím potvrďte svoju emailovú adresu. Váš registračný kľúč je "${userUUID}". Zadajte tento kľúč do formulára na stránke ${confirmUrl}.`,
                    `<h1>Vitajte ${req.body.username},</h1><p>na dokončenie registrácie prosím potvrďte svoju emailovú adresu. Váš registračný kľúč je "${userUUID}". Zadajte tento kľúč do formulára na stránke ${confirmUrl}. Pre jednoduchosť môžete využiť nasledujúci odkaz: <a href="${confirmUrl}${userUUID}">aktivovať</a></p>`
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

export const resetPasswordLink = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = req.body.email;
        await sequelize.transaction(async (t) => {
            const user = await User.scope('authScope').findOne({
                where: {
                    email,
                },
                transaction: t,
            });

            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.ACCOUNT_DOESNT_EXIST;
                error.statusCode = 404;
                throw error;
            }

            const uuid = uuidv4();

            await user.update(
                { uuid },
                {
                    fields: ['uuid'],
                    transaction: t,
                }
            );

            const resetUrl =
                process.env.RESET_URL ?? 'http://localhost:3000/reset/';
            const emailInfo = await sendMail(
                req.body.email,
                'Reset hesla',
                `Dobrý deň ${user.username}, vyžiadali ste si reset vašeho hesla. Váš kľúč na zmenu hesla je "${uuid}". Zadajte tento kľúč do formulára na stránke ${resetUrl}.`,
                `<h1>Dobrý deň ${user.username},</h1><p>vyžiadali ste si reset vašeho hesla. Váš kľúč na zmenu hesla je "${uuid}". Zadajte tento kľúč do formulára na stránke ${resetUrl}. Pre jednoduchosť môžete využiť nasledujúci odkaz: <a href="${resetUrl}${uuid}">resetovať heslo</a></p>`
            );

            if (emailInfo.rejected.length > 0) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.UNABLE_TO_SENT_REG_EMAIL;
                error.statusCode = 503;
                throw error;
            }
        });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const uuid = req.body.uuid;
        const newPassword = req.body.newPassword;
        const username = req.body.username;

        const success = await sequelize.transaction(async (t) => {
            const user = await User.scope('authScope').findOne({
                where: {
                    uuid,
                    username,
                },
                transaction: t,
            });

            if (!user) {
                const error = new CustomError();
                error.code = CUSTOM_ERROR_CODES.ACCOUNT_DOESNT_EXIST;
                error.statusCode = 404;
                throw error;
            }

            // if uuid updated more than N hours ago, don't allow to reset
            if (
                user.updatedAt <
                moment()
                    .subtract(+(process.env.RESET_LINK_VALIDITY ?? 12), 'hours')
                    .toDate()
            ) {
                await user.update(
                    { uuid: null },
                    {
                        fields: ['uuid'],
                        transaction: t,
                    }
                );
                return false;
            } else {
                await user.update(
                    { password: newPassword, uuid: null, confirmed: true },
                    {
                        fields: ['password', 'uuid', 'confirmed'],
                        transaction: t,
                    }
                );
            }
            return true;
        });
        if (success) {
            res.status(204).send();
        } else {
            const error = new CustomError();
            error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
            error.statusCode = 401;
            throw error;
        }
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
        { expiresIn: process.env.TOKEN_EXPIRES_IN ?? '1h' }
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
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '30d' }
    );
    return refreshToken;
};
