import fs from 'fs';
import path from 'path';
import {config} from '../config.js';
import * as userRepository from '../db/auth.js';
import * as postRepository from '../db/posts.js';

export async function create(req, res){
    const username = req.username;

    const {title, text} = req.body;
    var image = null;
    if (req.file){
        image = req.file.filename;
    }
    const createdAt = new Date();

    postRepository.createPost({
        title,
        text,
        image,
        createdAt,
        username
    });
    res.redirect('/posts');
}

export async function update(req, res){
    const id = req.params.id;
    const isValid = await validateUser(id, req.username);
    if (!isValid) {
        console.log("valid");
        return res.status(401).json({message : "권한이 없습니다."});
    }

    const {title, text} = req.body; 
    var image = null;
    if (req.file){  // 사진을 새로 업로드할 경우
        const post = await postRepository.findByPostId(id);
        fs.promises.unlink(`./public/images/posts/${post.image}`).then(console.log).catch(console.error);

        image = req.file.filename;
    }
    
    postRepository.updatePost({
        id,
        title,
        text,
        image
    });
    res.end();
}

export async function remove(req, res){
    const id = req.params.id;
    const isValid = await validateUser(id, req.username);
    if (!isValid) {
        return res.status(401).json({message : "권한이 없습니다."});
    }
    
    const post = await postRepository.findByPostId(id);
    if(post.image != null) {
        fs.promises.unlink(`./public/images/posts/${post.image}`).then(console.log).catch(console.error);
    }
    postRepository.deletePost(id);
    res.end();
}

async function validateUser(postId, reqUsername) {
    const post = await postRepository.findByPostId(postId);
    const username = post.username; 
    if (reqUsername == username) {
        return true;
    }
    else {
        return false;
    }
}

export async function getList(req, res, next){
    const username = req.username;
    const posts = await postRepository.findByUsername(username);
    const count = await postRepository.countByUsername(username);

    res.render('postList', { posts : posts, count : count });
}

export async function getPost(req, res){
    const id = req.params.id;
    const post = await postRepository.findByPostId(id);

    const title = post.title;
    const text = post.text;
    const image = post.image;

    const status = req.query.status;
    if (status == 'update') {
        res.render('postUpdate', { id : id, title : title, text : text, image : image });
    }
    else {
        res.render('postRead', { id : id, title : title, text : text, image : image });
    }
}