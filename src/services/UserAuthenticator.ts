import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';
import User from '../models/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: Omit<User, 'encrypted_password'>;
  token: string;
}

class UserAuthenticator {
  public async authenticate({ email, password }: IRequest): Promise<IResponse> {
    const userRepository = getRepository(User);

    const userFound = await userRepository.findOne({ where: { email } });

    if (!userFound) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(
      password,
      userFound.encrypted_password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, { subject: userFound.id, expiresIn });

    const { encrypted_password, ...user } = userFound;

    return { user, token };
  }
}

export default UserAuthenticator;
