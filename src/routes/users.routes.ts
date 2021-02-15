import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import UserCreator from '../services/UserCreator';
import UserAvatarChanger from '../services/UserAvatarChanger';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const userCreator = new UserCreator();

    const user = await userCreator.create({ name, email, password });

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const userAvatarChanger = new UserAvatarChanger();

      const user = await userAvatarChanger.change({
        userId: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  },
);

export default usersRouter;
