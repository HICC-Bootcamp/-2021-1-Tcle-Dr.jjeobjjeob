import { resolveInclude } from 'ejs';
import {db} from './database.js';

export async function createPost(post) {
    const {title, text, image, createdAt, username} = post;
    return db.execute(
        'INSERT INTO posts (title, text, image, createdAt, username) VALUES (?,?,?,?,?)',
        [title, text, image, createdAt, username]
    );
}