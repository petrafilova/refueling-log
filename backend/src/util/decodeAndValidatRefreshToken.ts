import jwt, {
    JsonWebTokenError,
    JwtPayload,
    NotBeforeError,
    Secret,
    TokenExpiredError,
} from 'jsonwebtoken';
import CustomError from '../models/customError';
import User from '../models/database/user';
import { CUSTOM_ERROR_CODES } from '../models/errorCodes';

/**
 *  @param {string} token - Token of authenticated user
 *  @returns {PromiseLike<string>} - Promise with username or throws error if token is invalid or user not found
 */
const decodeAndValidateRefreshToken = async (token: string): Promise<string> => {
    try {
        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SIGN_KEY as Secret
        ) as JwtPayload;

        if (!decodedToken || decodedToken.refresh !== true) {
            throw invalidCredentialsError();
        }

        const employee = await User.findOne({
            where: {
                username: decodedToken.username,
            },
        });

        if (!employee) {
            throw invalidCredentialsError();
        }

        return decodedToken.username;
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

export default decodeAndValidateRefreshToken;
