import express from 'express';
const app=express();
import userRouter from './routes/user.router.js'
app.use(express.json())
app.use('/user',userRouter)

const PORT=process.env.PORT || 3000;



app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
})