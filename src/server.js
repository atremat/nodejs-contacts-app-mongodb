import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message:
        "you can get all contacts via GET '/students' or get contacts by id via GET '/students/:studentId'",
    });
  });

  // app.get('/students', async (req, res) => {
  //   const students = await getAllStudents();

  //   res.status(200).json({
  //     data: students,
  //   });
  // });

  // app.get('/students/:studentId', async (req, res) => {
  //   const { studentId } = req.params;
  //   const student = await getStudentById(studentId);

  //   res.status(200).json({
  //     data: student,
  //   });
  // });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log('\x1b[42m%s\x1b[0m', `Server is running on port ${PORT}`);
  });
};
