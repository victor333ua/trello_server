import { User } from "@prisma/client";
import express from "express";
import passport from "passport";
import { cookieAttr, COOKIE_NAME } from "../constants";

const router = express.Router();

const cb = async (req: any, res: any, err: any, user: Partial<User>, info: any) => {
    if (user) {
        // res.cookie(COOKIE_NAME, `${user.id}`, cookieAttr);
        req.session.userId = user.id;
        res.redirect(`${process.env.CORS_ORIGIN}/`);
        return;
    }
    
    let errorMessage = err 
        ? err.message       // with errorCode from prisma
        : info?.message;

    res.redirect(`${process.env.CORS_ORIGIN}/oauth2Error`+
        `?error=${errorMessage}`);   
};  

router.get('/oauth2/google/login', passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: false 
}));

router.get(process.env.GOOGLE_URI_REDIRECT as string, (req, res, next) => {
    passport.authenticate('google', {
            session: false
            // successRedirect: URL,
            // failureRedirect: '../login/failed',
            // failureMessage: true, // don't work
        }, 
        (err, user, info) => {
            (async () => await cb(req, res, err, user, info))();
        }        
    )(req, res, next)
});

router.get('/oauth2/github/login', passport.authenticate('github', {
    scope: ['user:email', 'read:user'],
    session: false 
}));

router.get(process.env.GITHUB_URI_REDIRECT as string, (req, res, next) => {
    passport.authenticate('github', {
            session: false
        }, 
        (err: any, user: any, info: any) => {
            (async () => await cb(req, res, err, user, info))();
        }        
    )(req, res, next)
});
export default router
