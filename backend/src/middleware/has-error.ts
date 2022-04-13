import { NextFunction, Request, Response } from 'express';
import CustomError from '../models/customError';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

const hasError = (
    error: CustomError,
    req: Request,
    res: Response,
    /* eslint-disable */ next: NextFunction
) => {
    console.error(error);
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).json({ code: CUSTOM_ERROR_CODES.CONSTRAINT_FAILED });
    } else if (error.name === 'SequelizeUniqueConstraintError') {   
        res.status(409).json({ code: CUSTOM_ERROR_CODES.UNIQUE_CONSTRAINT_ERROR });  
    } else if (error instanceof CustomError) {
        const status = error?.statusCode || 500;
        res.status(status).json({
            message: error.message,
            code: error.code,
            data: error.data,
        });
    } else {
        res.status(500).json({ code: CUSTOM_ERROR_CODES.GENERAL_ERROR });
    }
};

export default hasError;
