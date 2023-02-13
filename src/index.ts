import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import route from './routes';


export const prisma = new PrismaClient();
  
  const init = async () => {
  
    const app = express();
  
    const corsOptions = {
      origin:[ 
        process.env.CORS_ORIGIN as string,
      ],
      credentials: true,
    }
  // necessary for oauth2 login 
    app.use(cors(corsOptions));
    // app.use(passport.initialize());
    app.use('/', route);
}; 

init()
  .catch((err) => {
    console.error(err);
});