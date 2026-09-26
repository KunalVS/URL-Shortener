import express from 'express';
import {shortenPostRequestBodySchema} from '../validations/requests.validation.js'
import  {nanoid} from 'nanoid';
import { urlsTable } from '../models/url.model.js';
import db from '../db/index.js'
import {InsertURLdata} from '../services/url.service.js'
import {ensureAuthenticated} from '../middleware/auth.middleware.js'
const router=express.Router()


router.post('/shorten',ensureAuthenticated,async function(req,res){

    const validationresult=await shortenPostRequestBodySchema.safeParseAsync(req.body)

    if(validationresult.error){
        return res.status(400).json({error:validationresult.error})
    }
    const {url,code}=validationresult.data;
    const user_id=req.user.id;

    const result=await InsertURLdata(code,url,user_id)

    

    return res.status(201).json({id:result.id,targetURL:result.targetURL,shortcode:result.shortcode})
}
);


router.get('/:shortCode',async function(req,res){
    const code=req.params.shortCode;

    const [result]=await db.select({
        tagetURL:urlsTable.targetURL
    }).from(urlsTable).where(eq(urlsTable.shortcode,code))

    if(!result){
        return res.status(400).json({error:"Invalid URL"})
    }
    return res.redirect(result.tagetURL)
})



export default router;