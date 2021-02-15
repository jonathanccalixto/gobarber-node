import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import User from '../models/User';

interface IRequest {
  userId: string;
  avatarFilename: string;
}

type IResponse = Omit<User, 'encrypted_password'>;

class UserAvatarChanger {
  public async change({
    userId,
    avatarFilename,
  }: IRequest): Promise<IResponse> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(userId);

    if (!user) throw new Error('Only authenticated users can change avatar.');

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) await fs.promises.unlink(userAvatarFilePath);
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    const { encrypted_password, ...response } = user;

    return response;
  }
}

export default UserAvatarChanger;
