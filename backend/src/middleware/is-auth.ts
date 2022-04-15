import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw invalidCredentialsError();
    }
    const splitedToken = authHeader.split(' ');
    if (splitedToken.length != 2) {
        throw invalidCredentialsError();
    }

    const token = splitedToken[1];
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SIGN_KEY!
        ) as JwtPayload;

        if (!decodedToken || decodedToken.refresh) {
            throw invalidCredentialsError();
        }

        // TODO consider if should check if user was deleted

        req.username = decodedToken.username;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            const error = new CustomError(err.message);
            error.code = CUSTOM_ERROR_CODES.EXPIRED_TOKEN;
            error.statusCode = 401;
            throw error;
        }
        if (err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
            const error = new CustomError(err.message);
            error.code = CUSTOM_ERROR_CODES.INVALID_TOKEN;
            error.statusCode = 401;
            throw error;
        }
        throw err;
    }
};

const invalidCredentialsError = (): CustomError => {
    const error = new CustomError();
    error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
    error.statusCode = 401;
    return error;
};

export default isAuth;
