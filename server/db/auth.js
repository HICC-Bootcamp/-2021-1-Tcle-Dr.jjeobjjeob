import { resolveInclude } from 'ejs';
import {db} from './database.js';

export async function findByUsername(username) {
    const [users, fields] = await db.execute('SELECT * FROM users WHERE username=?', [username]);
    return users[0];
}

export async function findByEmail(email) {
    const [users, fields] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
    return users[0];
}

export async function createUser(user) {
    const {username, password, email} = user;
    return db.execute(
        'INSERT INTO users (username, password, email) VALUES (?,?,?)',
        [username, password, email]
    );
}

export async function storeToken(username, refreshToken) {
    return db.execute('UPDATE users SET token=? WHERE username=?', [refreshToken, username]);
}