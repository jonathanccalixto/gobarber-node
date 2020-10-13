import { Router } from 'express';

import UserCreator from '../services/UserCreator';

const usersRouter = Router();

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

export default usersRouter;
