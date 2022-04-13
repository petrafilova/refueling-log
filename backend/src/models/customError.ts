import { CUSTOM_ERROR_CODES } from './errorCodes';

class CustomError extends Error {
    statusCode = 500;
    code?: CUSTOM_ERROR_CODES;
    data?: {
        field: string;
        error: string;
    }[];
}

export default CustomError;
