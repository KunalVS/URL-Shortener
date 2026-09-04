import express from 'express';
import db from '../db/index.js'
import { userTable } from '../models/index.js';
import {HashPasswordwithsalt} from '../utils/hash.js'
import { signupPostRequest } from '../validations/requests.validation.js';

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







export default router