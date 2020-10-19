import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

type IResponse = Omit<User, 'encrypted_password'>;

class UserCreator {
  public async create({ name, email, password }: IRequest): Promise<IResponse> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({ where: { email } });
    if (checkUserExists) {
      throw new Error('Email address already used!');
    }

    const encryptedPassword = await hash(password, 8);

    const user = await userRepository.create({
      name,
      email,
      encrypted_password: encryptedPassword,
    });

    await userRepository.save(user);

    const { encrypted_password, ...response } = user;

    return response;
  }
}

export default UserCreator;
