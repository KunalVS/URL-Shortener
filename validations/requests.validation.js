import {z} from 'zod';

export const signupPostRequest=z.object({
    firstname:z.string(),
    lastname:z.string(),
    email:z.string().email(),
    password:z.string().min(3)
})