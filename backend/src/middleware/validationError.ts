import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

const validationError = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mappedErrors = errors.array().map((validationError) => {
            return {
                field: validationError.param,
                error: validationError.msg,
            };
        });

        const error = new CustomError();
        error.code = CUSTOM_ERROR_CODES.VALIDATION_FAILED;
        error.statusCode = 422;
        error.data = mappedErrors;
        throw error;
    }
    next();
};

export default validationError;
