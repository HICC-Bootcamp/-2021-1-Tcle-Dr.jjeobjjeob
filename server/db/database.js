import mysql from 'mysql2';
import { config } from '../config.js';

const pool = mysql.createPool({ // DB 접속하고 SQL 실행할 수 있게 해주는 class
    host: config.db.host,
    user: config.db.user,
    database: config.db.database,
    password: config.db.password,
});

export const db = pool.promise();
