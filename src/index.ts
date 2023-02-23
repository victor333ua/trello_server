import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import route from './routes';
import bodyParser from 'body-parser';


export const prisma = new PrismaClient();
  
const app = express();
app.use(bodyParser.json());
  
const corsOptions = {
  origin:[ 
    process.env.CORS_ORIGIN as string,
  ],
  credentials: true,
};    
app.use(cors(corsOptions));
// app.use(passport.initialize());
app.use('/', route);    

const port = 4000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
});