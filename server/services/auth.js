import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { nextTick } from 'process';
import * as userRepository from '../db/auth.js'

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
    await bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) return next(err);
            // console.log(salt);
            // console.log(hash);
            userRepository.createUser({
                username,
                password: hash,
                salt,
                email
            });  
        });
      });
    res.redirect('/');
}
