import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js'

export async function signup(req, res){
    const {username, password, password_confirm, email} = req.body;
    const foundUsername = await userRepository.findByUsername(username);
    if (foundUsername) {    // 이미 있는 username인지 확인
        return res.status(409).json({message: `${username} already exists`});
    }
    if (password != password_confirm) { // 비밀번호와 비밀번호 확인의 일치 확인
        return res.status(400).json({message: `password and password_confirm are not the same`});
    }
    const foundEmail = await userRepository.findByEmail(email);
    if (foundEmail) {   // 이미 있는 email인지 확인
        return res.status(409).json({message: `${email} already exists`});
    }
    const hashedPw = await bcrypt.hash(password, 12);
    await userRepository.createUser({
        username,
        password: hashedPw,
        email,
    });
    res.sendStatus(201);
}
