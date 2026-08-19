import express from 'express';
import db from '../db/index'
import { userTable } from '../models/index';
import {randomBytes,createHmac} from 'crypto'
const router=express.Router()

router.post('/signup',async(req,res)=>{
        const {name,email,password}=req.body
    
    if(!name || !email || !password){
        return res.status(400).json("Error:You need to enter all required field")
    }
    
    const [existingUser]=await db.select({
        id:userTable.id
    }).from(userTable).where(eq(userTable.email,email))

    if(existingUser){
        return res.status(400).json(`User with email ${email} already exists!`)
    }
    
    const salt=randomBytes(256).toString('hex')

    const hashePassword=createHmac('sha256',salt).update(password).digest('hex')

    const User=await db.insert(userTable).values({
        name:name,
        email:email,
        password:hashePassword,
        salt:salt
    }).returning({id:userTable.id})


    return res.status(200).json({data:{userId:User.id}});



    
    
    })







export default router