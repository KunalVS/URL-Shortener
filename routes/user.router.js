import express from 'express';
import 'dotenv'
import db from '../db/index.js'
import { userTable } from '../models/index.js';
import {HashPasswordwithsalt} from '../utils/hash.js'
import { signupPostRequest, loginPostRequest } from '../validations/requests.validation.js';
import { createtoken } from '../utils/token.js';


import {CheckExistingUser,CreateUser} from '../services/user.service.js'

const router=express.Router()

router.post('/signup',async(req,res)=>{
        const validationresult=await signupPostRequest.safeParseAsync(req.body)
        console.log("Validation done")
    
   if(validationresult.error){
    return res.status(400).json({error:validationresult.error.message})
   }

   const {firstname,lastname,email,password} =validationresult.data;
    
   //Check if the user alreeady exists
    const existingUser=await CheckExistingUser(email);

    if(existingUser){
        return res.status(400).json(`User with email ${email} already exists!`)
    }
    
   const {salt,hashedPassword}=HashPasswordwithsalt(password);


    //Insert user info
    const User=await CreateUser(email,firstname,lastname,hashedPassword,salt);


    return res.status(200).json({data:{userId:User.id}});



    
    
    })


    router.post('/login',async(req,res)=>{
        const validationresult=await loginPostRequest.safeParseAsync(req.body)
 
        if(!validationresult.success){
            return res.status(400).json({error:"Please enter valid email and password"})
        }
         
        const {email,password}=validationresult.data;

        const user=await CheckExistingUser(email);

        if(!user){
            return res.status(400).json({error:`User with email ${email} does not exist!!`})
        }

        const {hashedPassword}=HashPasswordwithsalt(password,user.salt)

        if(hashedPassword!==user.password){
            return res.status(400).json({error:`Incorrect password`})
        }

        const token=await createtoken({id:user.id})

        return res.status(200).json({token:token});
    })







export default router