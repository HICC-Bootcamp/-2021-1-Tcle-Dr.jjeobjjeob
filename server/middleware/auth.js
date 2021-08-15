import jwt from 'jsonwebtoken';
import { isJwtExpired } from 'jwt-check-expiration';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';

const authError = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  var accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.redirect('/auth/login_error');
  }

  if (isJwtExpired(accessToken)) {
    const user_id = jwt.decode(accessToken).id
    
    const user = await userRepository.findById(user_id);
    if (!user) {
      return res.redirect('/auth/login_error');
    }

    const refreshToken = user.token;
    if (!refreshToken || isJwtExpired(refreshToken)) {
      return res.redirect('/auth/login_error');
    }

    accessToken = await createJwtToken(user_id);  // 재발급
  }

  jwt.verify(
    accessToken,
    config.jwt.secretKey,
    async (error, decoded) => {
      if (error) {
        return res.redirect('/auth/login_error');
      }

      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.redirect('/auth/login_error');
      }

      next();
    }
  );
};

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {expiresIn: config.jwt.accessExpriresIn});
}