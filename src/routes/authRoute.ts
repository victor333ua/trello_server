import express, { CookieOptions } from "express";
import { prisma } from "../index";
import bcrypt from 'bcrypt';
import { COOKIE_NAME, __prod__ } from "../constants";

const authRouter = express.Router();

const cookieAttr: CookieOptions = {
    httpOnly: __prod__,  
    sameSite: __prod__ ? 'none' : 'lax',  
    secure: __prod__,
    maxAge: 1000 * 60 * 60 * 24 * 365,
}

authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await prisma.user.findUnique({
            where: { email }
        });
        if (user) throw new Error(
            JSON.stringify({email:'user already exist!!!'}));

        const cryptPassword = await bcrypt.hash(password, 10); 
        user = await prisma.user.create({
            data: { email, password: cryptPassword }
        });

        res.cookie(COOKIE_NAME, `${user.id}`, cookieAttr).json({user});
    } catch(err: any){
        res.status(400).send(err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) throw new Error(
            JSON.stringify({email: 'no such user!'}));
        if (!user.password) 
            throw new Error(JSON.stringify(
                {email: 'this user was authorized through social media !'}));

        const isCompare = await bcrypt.compare(password, user.password);
        if (!isCompare)  throw new Error(JSON.stringify(
            {password:'invalid password'}));

        res.cookie(COOKIE_NAME, `${user.id}`, cookieAttr).json({user});
    } catch(err: any){
        res.status(400).send(err.message);
    }
});

authRouter.get('/logout', async (req, res) => {
    res.clearCookie(COOKIE_NAME);
})
export default  authRouter;