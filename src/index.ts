import express from 'express';
import { PrismaClient } from './generated';
import cors from 'cors';
import route from './routes';


export const prisma = new PrismaClient();
  
const app = express();
  
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