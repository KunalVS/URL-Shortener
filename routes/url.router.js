import express from 'express';
import {shortenPostRequestBodySchema,updatecodebodyschema,updateurlbodyschema} from '../validations/requests.validation.js'
import { urlsTable } from '../models/url.model.js';
import db from '../db/index.js'
import {eq,and} from 'drizzle-orm'
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

router.get('/myurls',ensureAuthenticated,async function(req,res){
       
    const {id}=req.user;

    const myurls=await db.select({
        id:urlsTable.id,
         shortCode:urlsTable.shortcode,
         targetURL:urlsTable.targetURL
    }).from(urlsTable).where(eq(urlsTable.userid,id))

    if(!myurls){
        return res.status(200).json({message:"Oops! There are no URLs registered to this email"})
    }

    return res.status(200).json({ myurls
    })

        
})

router.delete('/:id',ensureAuthenticated,async function(req,res){
        const {id}=req.params;

        const checkurl=await db.select({
            targetURL:urlsTable.targetURL,
            shortcode:urlsTable.shortcode
        }).from(urlsTable).where(eq(urlsTable.id,id))

        if(checkurl.length===0){
            return res.status(200).json({message:"The code you want to delete does not exists!!"})
        }

        const deleted=await db.delete(urlsTable)
        .where(and(eq(urlsTable.id,id),eq(urlsTable.userid,req.user.id)))
        .returning({id:urlsTable.id})

        


        if(deleted.length===0){
         return res.status(403).json({ message: "You are not authorized to delete this URL, or it no longer exists." });


        }

        return res.status(200).json({DELETED:"TRUE"})
})


router.patch('/updatecode/:id',ensureAuthenticated,async function(req,res){
       const validatedcode=await  updatecodebodyschema.safeParseAsync(req.body);
       const {id}=req.params

       if(validatedcode.error){
        return res.status(400).json({error:validatedcode.error})
       }
       const {code}=validatedcode.data;
      try{

       const [updated]=await db.update(urlsTable).set({
          shortcode:code
       }).where(and(eq(urlsTable.userid,req.user.id),eq(urlsTable.id,id)))
       .returning({id:urlsTable.id})


       if(!updated){
        return res.status(400).json({error:`Couldn't find URL withh ID ${updated.id}`})
       }


       return res.status(200).json({message:"Code updated successfully!"})

    }catch(err){
        throw err;
    }



      


})


router.patch('/updateurl/:id',ensureAuthenticated,async function(req,res){
    const validatedurl=await updateurlbodyschema.safeParseAsync(req.body)
    const {id}=req.params

    if(validatedurl.error){
        return res.status(400).json({error:validatedurl.error})
    }
    const {url}=validatedurl.data;
    const [updated]=await db.update(urlsTable).set({
        targetURL:url
    }).where(and(eq(urlsTable.userid,req.user.id),eq(urlsTable.id,id)))
    .returning({id:urlsTable.id})
    
    if(!updated){
        return res.status(400).json({error:`URL with id ${id} was not found`})
    }
    return res.status(200).json({message:"Successfully updated the URL !"})

})


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