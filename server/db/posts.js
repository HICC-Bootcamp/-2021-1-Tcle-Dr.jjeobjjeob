import { resolveInclude } from 'ejs';
import {db} from './database.js';

export async function findByUsername(username) {
    const [posts, fields] = await db.execute('SELECT * FROM posts WHERE username=?', [username]);
    return posts;
}

export async function countByUsername(username) {
    const [count, fields] = await db.execute('SELECT COUNT(*) as count FROM posts WHERE username=?', [username]);
    return count[0].count;
}

export async function findByPostId(id) {
    const [posts, fields] = await db.execute('SELECT * FROM posts WHERE id=?', [id])
    return posts[0];
}

export async function createPost(post) {
    const {title, text, image, createdAt, username} = post;
    return db.execute(
        'INSERT INTO posts (title, text, image, createdAt, username) VALUES (?,?,?,?,?)',
        [title, text, image, createdAt, username]
    );
}

export async function updatePost(post) {
    const {id, title, text, image} = post;
    if (image != null) {
        db.execute(
            'UPDATE posts SET image=? WHERE id=?',
            [image, id]
        );
    }
    return db.execute(
        'UPDATE posts SET title=?, text=? WHERE id=?',
        [title, text, id]
    );
}

export async function deletePost(id) {
    return db.execute('DELETE FROM posts WHERE id=?', [id]);
}