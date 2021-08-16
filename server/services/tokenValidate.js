import jwt from 'jsonwebtoken';
import { isJwtExpired } from 'jwt-check-expiration';
import * as userRepository from '../db/auth.js';
import {config} from '../config.js';

const authError = '인증이 만료되었습니다.';
const invalidError = '잘못된 요청입니다.';

export const isAuth = async (req, res, next) => {
  var accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.render('login', { errorMsg : authError });
  }

  if (isJwtExpired(accessToken)) {
    const username = jwt.decode(accessToken).username;
    
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return res.render('login', { errorMsg : invalidError });
    }

    const refreshToken = user.token;
    if (!refreshToken || isJwtExpired(refreshToken)) {
      return res.render('login', { errorMsg : authError });
    }

    accessToken = await createJwtToken(username);  // 재발급
  }

  jwt.verify(
    accessToken,
    config.jwt.secretKey,
    async (error, decoded) => {
      if (error) {
        return res.render('login', { errorMsg : authError });
      }

      const user = await userRepository.findByUsername(decoded.username);
      if (!user) {
        return res.render('login', { errorMsg : authError });
      }

      next();
    }
  );
};

function createJwtToken(username) {
  return jwt.sign({ username }, config.jwt.secretKey, {expiresIn: config.jwt.accessExpriresIn});
}