import {config} from '../config.js';
import * as userRepository from '../db/auth.js';
import * as postRepository from '../db/posts.js';

export async function write(req, res){
    const {title, text} = req.body;
    var image = null;
    if (req.file){
        image = req.file.filename;
    }
    const createdAt = new Date();
    const username = req.username;

    postRepository.createPost({
        title,
        text,
        image,
        createdAt,
        username
    });
    res.redirect('/posts');
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

    res.render('postRead', { id : id, title : title, text : text, image : image });
}

export async function modify(req, res){
    const id = req.params.id;
    const post = await postRepository.findByPostId(id);

    const title = post.title;
    const text = post.text;
    const image = post.image;

    res.render('postModify', { id : id, title : title, text : text, image : image });
}

export async function update(req, res){
    const id = req.params.id;
    console.log(req.body);
    const {title, text} = req.body;
    
    var image = null;
    if (req.file){
        image = req.file.filename;  
    }

    postRepository.updatePost({
        id,
        title,
        text,
        image
    });
    res.redirect('/posts');
}