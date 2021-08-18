import { resolveInclude } from 'ejs';
import {db} from './database.js';

export async function findByUsername(username) {
    return db.execute('SELECT * FROM posts WHERE username=?', [username])
    .then(result => result[0]);
}

export async function countByUsername(username) {
    return db.execute('SELECT COUNT(*) as count FROM posts WHERE username=?', [username])
    .then(result => result[0][0].count);
}

export async function createPost(post) {
    const {title, text, image, createdAt, username} = post;
    return db.execute(
        'INSERT INTO posts (title, text, image, createdAt, username) VALUES (?,?,?,?,?)',
        [title, text, image, createdAt, username]
    );
}