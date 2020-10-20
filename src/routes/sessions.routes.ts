import { Router } from 'express';

import UserAuthenticator from '../services/UserAuthenticator';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticator = new UserAuthenticator();

    const { user, token } = await authenticator.authenticate({
      email,
      password,
    });

    return response.json({ user, token });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default sessionsRouter;
