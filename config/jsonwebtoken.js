export const JWT_SECRET = process.env.TOKEN_SECRET || 'UxZWo1ZRt2D96warRUeAr4go0DlcHPDISMR';

export const EXPIRATION = parseInt(process.env.SESSION_LIFETIME, 10) || 3600;

export const AUTHORIZATION_TIMEOUT = 15000;
