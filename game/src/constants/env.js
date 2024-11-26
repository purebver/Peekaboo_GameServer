import dotenv from 'dotenv';

dotenv.config();

// SERVER
export const TCP_HOST = process.env.TCP_HOST || '0.0.0.0';
export const TCP_PORT = process.env.TCP_PORT || '6666';
export const UDP_PORT = process.env.UDP_PORT || '6667';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

// DB 게임서버에서의 사용여부 X ?
export const DB_NAME = process.env.DB_NAME || 'USERS_DB';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'aaaa4321';
export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_PORT = process.env.DB_PORT || '3306';

// REDIS
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const SECRET_KEY = process.env.SECRET_KEY;

// 테스트용 토큰
export const Test_Token = process.env.Test_Token;
