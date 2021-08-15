import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue=undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
};

export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        refreshExpriresIn: required('JWT_REFRESH_EXPIRES_IN', '1 day'),
        accessExpriresIn: required('JWT_ACCESS_EXPIRES_IN', '5 h'),
    },
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),      
    },
};
