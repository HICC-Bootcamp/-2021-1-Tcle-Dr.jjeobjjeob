import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';

const saltRounds = 12;

export async function signup(req, res){
    const {username, password, password_confirm, email} = req.body;
    const foundUsername = await userRepository.findByUsername(username);
    if (foundUsername) {
        return res.status(409).json({message: `${username} already exists`});
    }
    if (password != password_confirm) {
        return res.status(400).json({message: `password and password_confirm are not the same`});
    }
    const foundEmail = await userRepository.findByEmail(email);
    if (foundEmail) {
        return res.status(409).json({message: `${email} already exists`});
    }
    const hashed = await bcrypt.hash(password, saltRounds);
    userRepository.createUser({
        username,
        password: hashed,
        email
    });  
    res.redirect('/auth/login');
}

export async function login(req, res){
    const {username, password} = req.body;
    const user = await userRepository.findByUsername(username);
    if (user == undefined) {
        return res.status(401).json({message: `Invalid user or password`});
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({message: `Invalid user or password`});
    }
    const token = createJwtToken(user.id);
    res.status(200).json({token, username});
}

function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {expiresIn: 2394820});
}