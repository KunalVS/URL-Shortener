import express from 'express';
import db from '../db/index.js'
import { userTable } from '../models/index.js';
import {randomBytes,createHmac} from 'crypto'
import { signupPostRequest } from '../validations/requests.validation.js';
import {eq} from 'drizzle-orm'

const router=express.Router()

router.post('/signup',async(req,res)=>{
        const validationresult=await signupPostRequest.safeParseAsync(req.body)
        console.log("Validation done")
    
   if(validationresult.error){
    return res.status(400).json({error:validationresult.error.message})
   }

   const {firstname,lastname,email,password} =validationresult.data;
    
    const [existingUser]=await db.select({
        id:userTable.id
    }).from(userTable).where(eq(userTable.email,email))
    console.log("checked for existing user")

    if(existingUser){
        return res.status(400).json(`User with email ${email} already exists!`)
    }
    
    const salt=randomBytes(256).toString('hex')

    const hashePassword=createHmac('sha256',salt).update(password).digest('hex')

    const [User]=await db.insert(userTable).values({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:hashePassword,
        salt:salt
    }).returning({id:userTable.id})
    console.log("Inserted new user")


    return res.status(200).json({data:{userId:User.id}});



    
    
    })







export default router