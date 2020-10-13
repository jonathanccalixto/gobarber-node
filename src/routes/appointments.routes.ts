import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentRepository';
import AppointmentCreator from '../services/AppointmentCreator';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const appointmentCreator = new AppointmentCreator();

    const appointment = await appointmentCreator.create({
      provider,
      date: parsedDate,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;
