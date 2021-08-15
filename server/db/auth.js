import { resolveInclude } from 'ejs';
import {db} from './database.js';

export async function findById(id) {
    return db.execute('SELECT * FROM users WHERE id=?', [id])
    .then(result => result[0][0]);
}

export async function findByUsername(username) {
    return db.execute('SELECT * FROM users WHERE username=?', [username])
    .then(result => result[0][0]);
}

export async function findByEmail(email) {
    return db.execute('SELECT * FROM users WHERE email=?', [email])
    .then(result => result[0][0]);
}

export async function createUser(user) {
    const {username, password, email} = user;
    return db.execute(
        'INSERT INTO users (username, password, email) VALUES (?,?,?)',
        [username, password, email]
    );
}

export async function storeToken(id, refreshToken) {
    return db.execute('UPDATE users SET token=? WHERE id=?', [refreshToken, id]);
}