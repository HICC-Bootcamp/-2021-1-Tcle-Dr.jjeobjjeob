import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';

const saltRounds = 12;

export async function signup(req, res){
    const {username, password, password_confirm, email} = req.body;
    const foundUsername = await userRepository.findByUsername(username);
    if (foundUsername) {
        return res.render('signup', { errorMsg : "사용 중인 아이디입니다." });
    }
    if (password != password_confirm) {
        return res.render('signup', { errorMsg : "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
    }
    const foundEmail = await userRepository.findByEmail(email);
    if (foundEmail) {
        return res.render('signup', { errorMsg : "사용 중인 이메일입니다." });
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
        return res.render('login', { errorMsg : invalidError });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.render('login', { errorMsg : invalidError });
    }
    
    const accessToken = await createJwtToken(user.username, config.jwt.accessExpriresIn);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true
    });
    const refreshToken = await createJwtToken(user.username, config.jwt.refreshExpriresIn);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    });
    userRepository.storeToken(user.username, refreshToken);
    
    res.redirect('/');
}

function createJwtToken(username, exp) {
    return jwt.sign({ username }, config.jwt.secretKey, {expiresIn: exp});
}