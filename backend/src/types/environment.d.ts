declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PWD: string;

            PORT: number;

            TOKEN_SIGN_KEY: string;

            DATABASE_PASSWORD: string;
            DATABASE_USER: string;
            DATABASE: string;
            DATABASE_HOST: string;
            DATABASE_PORT: number;
            DATABASE_LOGGING: boolean;

            EMAIL_HOST: string;
            EMAIL_PORT: number;
            EMAIL_USER: string;
            EMAIL_PASS: string;
            EMAIL_FROM: string;

            TOKEN_EXPIRES_IN: string;
            REFRESH_TOKEN_EXPIRES_IN: string;

            CONFIRM_URL: string;
        }
    }
}
