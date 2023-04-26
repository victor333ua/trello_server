import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/route';
import authRouter from './routes/authRoute';
import oauth2Router from './routes/oauth2Route';
import passport from 'passport';
import './passport'

export const prisma = new PrismaClient();
  
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
 
const corsOptions = {
  origin:[ 
    process.env.CORS_ORIGIN as string,
  ],
  credentials: true,
};    
app.use(cors(corsOptions));
app.use(passport.initialize());

app.use('/', router);
app.use('/auth', authRouter); 
app.use('/', oauth2Router);    


const port = 4000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`)
});