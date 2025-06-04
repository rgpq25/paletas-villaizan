declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: number;
        JWT_SECRET_KEY: string;
        JWT_REFRESH_TOKEN_KEY: string;
    }
}
