const Quiz=require('../models/QuizModel');
const bcrypt=require('bcryptjs')
const createQuiz=async(req,res)=>{
    try{
        const{quizName,description,startTime,endTime,timerDuration,adminPassword}=req.body;
        if(!quizName || !description|| !startTime||!endTime|| !timerDuration||!adminPassword){
            return res.status(400).json({message:'All fields are required'});
        }
        const hashedPassword=await bcrypt.hash(adminPassword,10);
        const quiz=new Quiz({
            quizName,
            description,
            startTime,
            endTime,
            timerDuration,
            adminPassword:hashedPassword,
        });
        const createdQuiz=await quiz.save();
        res.status(201).json({
            message:'Quiz created successfully',
            quiz:createdQuiz,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message:'server error'})
    }
};

const joinQuiz=async(req,res)=>{
    try{
        const{quizID}=req.params;
        const{userName:participantName,email:participantEmail}=req.body;
        const quiz= await Quiz.findOne({_id:quizID});
        if(!quiz){
            return res.status(404).json({message:'Quiz not found'});
        }
        const currentTime=Date.now();
        if(currentTime>quiz.endTime){
            return res.status(200).json({
                message:'Quiz has already ended',
                quizID:quizID,
                quiz:{
                    _id:quiz._id,
                    quizName:quiz.quizName,
                    description:quiz.description,
                    startTime:quiz.startTime,
                    endTime:quiz.endTime,
                    questions:quiz.questions,
                    timerDuration:quiz.timerDuration,
                    createdAt:quiz.createdAt
                }
            });
        }
        const existingParticipant=quiz.results.find(result=>result.participantEmail===participantEmail);
        if(existingParticipant){
            return res.status(400).json({message:"Participant has already joined the quiz"});
        }
        const newResult={
            participantName,
            participantEmail,
            score:0,
            finishTime:0
        };
        quiz.results.push(newResult);
        await quiz.save();
        return res.status(200).json({
            message:'Participant detaisl saved successfully',
            quizID:quizID,
            quiz:{
                 _id:quizID,
                    quizName:quiz.quizName,
                    description:quiz.description,
                    startTime:quiz.startTime,
                    endTime:quiz.endTime,
                    questions:quiz.questions,
                    timerDuration:quiz.timerDuration,
                    createdAt:quiz.createdAt
            }
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
};
const saveQuiz=async(req,res)=>{
    try{
        const{quizID}=req.params;
        const{participantEmail,score,finishTime}=req.body;
        const quiz=await Quiz.findOne({_id:quizID});
        if(!quiz){
            return res.status(404).json({message:'Qiz not found'});
        }
        const participant=quiz.results.find(result=>result.participantEmail===participantEmail);
        if(!participant){
            return res.status(404).json({message:'Participant not found in the quiz'});
        }
        participant.score=score;
        participant.finishTime=finishTime;
        await quiz.save();
        return res.status(200).json({
            message:'Quiz result saved successfully',
            participantEmail:participantEmail,
            score:score,
            finishTime:participant.finishTime
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
};
module.exports={
    createQuiz,
    joinQuiz,
    saveQuiz
};