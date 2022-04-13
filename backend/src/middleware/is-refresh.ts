import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

const isRefresh = (req: Request, res: Response, next: NextFunction) => {
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

        if (!decodedToken || decodedToken.refresh !== true) {
            throw invalidCredentialsError();
        }

        // TODO check if user exists ... could be deleted, meantime refresh token is still valid

        req.username = decodedToken.username;
        next();
    } catch (err) {
        throw err;
    }
};

const invalidCredentialsError = (): CustomError => {
    const error = new CustomError();
    error.code = CUSTOM_ERROR_CODES.INVALID_CREDENTIALS;
    error.statusCode = 401;
    return error;
};

export default isRefresh;
