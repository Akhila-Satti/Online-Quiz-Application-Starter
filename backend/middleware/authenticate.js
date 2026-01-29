const jwt=require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET||'admin123';
const Quiz=require('../models/QuizModel');
const authenticate=async(req,res,next)=>{
    const token=req.cookies?.token;
    if(!token){
        return res.status(403).json({message:'Access denied.No token provided in cookies.'});
    }
    try{
        const verified=jwt.verify(token,JWT_SECRET);
        req.quiz=verified;
        const quizID=req.quiz.quizID;
        const quiz=await Quiz.findOne({_id:quizID});
        if(quiz.adminToken!==token){
            quiz.adminToken="";
            await quiz.save();
            res.clearCookie('token',{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production'
            });
        }
        next();
    }catch(error){
        return res.status(401).json({message:'Invalid or expired token in cookies.'});
    }
};
module.exports= authenticate;