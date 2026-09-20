import db from '../db/index.js'
import {eq} from 'drizzle-orm'
import { userTable } from '../models/index.js';


export async function CheckExistingUser(email){
    const [existingUser]=await db.select({
        id:userTable.id,
        firstname:userTable.firstname,
        lastname:userTable.lastname,
        password:userTable.password,
        salt:userTable.salt
    }).from(userTable).where(eq(userTable.email,email))
    
   return existingUser;
    
}

export async function CreateUser(email,firstname,lastname,password,salt){
    const CreatedUser=await db.insert(userTable).values({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:password,
        salt:salt
    }).returning({id:userTable.id})
   
    return CreatedUser;
}


