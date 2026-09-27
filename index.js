import express from 'express';
const app=express();
import userRouter from './routes/user.router.js'
import urlRouter from './routes/url.router.js'
import { authenticationmiddlewarre } from './middleware/auth.middleware.js'
app.use(express.json())
app.use(authenticationmiddlewarre);
app.use('/user',userRouter)
app.use(urlRouter)
app.use((err , req ,res ,next)=>{
    console.error(err)
    res.status(500).json({error:"Something went wrong on our side"})
})

const PORT=process.env.PORT || 3000;



app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
})