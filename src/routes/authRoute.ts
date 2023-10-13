import express from "express";
import { prisma } from "../index";
import bcrypt from 'bcrypt';
import { cookieAttr, COOKIE_NAME, __prod__ } from "../constants";
import '../types'

const authRouter = express.Router();

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

        // res.cookie(COOKIE_NAME, `${user.id}`, cookieAttr);
        req.session.userId = user.id;
        res.json({ user: { id: user.id, email: user.email }});
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

        // res.cookie(COOKIE_NAME, `${user.id}`, cookieAttr);
        req.session.userId = user.id;
        res.json({ user: { id: user.id, email: user.email, name: user.name }});
    } catch(err: any){
        res.status(400).send(err.message);
    }
});

authRouter.get('/logout', async (req, res) => {
    // res.clearCookie(COOKIE_NAME).end();
    req.session.destroy(err => {
        res.clearCookie(COOKIE_NAME).end();
        if (err)
            res.status(400).send(err.message);
    });
});

export default  authRouter;