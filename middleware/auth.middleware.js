import {verifyToken}  from '../utils/token.js'
export function authenticationmiddlewarre(req,res,next){
    const authHeader=req.headers['authorization'];

    if(!authHeader){
        return next();
    }
    if(!authHeader.startsWith('Bearer')){
        return res.status(400).json({error:"Authirization header must start with Bearer!"})
    }
   
    const token=authHeader.split(' ')[1];

    const payload=verifyToken(token)

    req.user=payload;
    next();
}


export function ensureAuthenticated(req,res,next){
     const userID =req.user?.id;

    if(!userID){
        return res.status(401).json({error:'you must be logged in to access resource'})
    }

    next();
}