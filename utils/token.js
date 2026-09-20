import { tokenvalidationschema } from '../validations/token.validations.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_SECRET;

export async function createtoken(payload){
    const validatetoken=await tokenvalidationschema.safeParseAsync(payload);

    if(validatetoken.error){
       throw new Error(validatetoken.error.message)
    }
    

   return jwt.sign(validatetoken.data,JWT_SECRET,{expiresIn:'1h'})
}