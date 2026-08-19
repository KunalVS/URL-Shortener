import express from 'express';
const app=express();
import userRouter from './routes/user.router'
app.use(express.json)


const PORT=process.env.PORT || 3000;

app.use('/user',userRouter)

app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
})