import {z} from 'zod';

export const signupPostRequest=z.object({
    firstname:z.string(),
    lastname:z.string(),
    email:z.string().email(),
    password:z.string().min(3)
})

export const loginPostRequest=z.object({
    email:z.string().email(),
    password:z.string().min(3)
})

export const shortenPostRequestBodySchema=z.object({
    url:z.string().url(),
    code:z.string().optional().min(6)
})

export const updatecodebodyschema=z.object({
    code:z.string().min(6)
})
export const updateurlbodyschema=z.object({
    url:z.url().string()
})