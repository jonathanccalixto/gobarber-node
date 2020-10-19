import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: Omit<User, 'encrypted_password'>;
}

class UserAuthenticator {
  public async authenticate({ email, password }: IRequest): Promise<IResponse> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) throw new Error('Incorrect email/password combination');

    const passwordMatched = await compare(password, user.encrypted_password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination');
    }

    const { encrypted_password, ...treatedUser } = user;

    return { user: treatedUser };
  }
}

export default UserAuthenticator;
