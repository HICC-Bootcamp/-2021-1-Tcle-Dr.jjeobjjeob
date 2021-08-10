import { resolveInclude } from 'ejs';
import {db} from '../db/database.js';

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