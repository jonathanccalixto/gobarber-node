import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class UserCreator {
  public async create({ name, email, password }: Request): Promise<User> {
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

    return user;
  }
}

export default UserCreator;
