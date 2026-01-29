const express=require('express');
const router=express.Router();
const{createQuiz,joinQuiz,saveQuiz}=require('../controllers/userController');
router.post('/create',createQuiz);
router.post('/joinquiz/:quizID',joinQuiz);
router.post('/savequiz/:quizID',saveQuiz);
module.exports=router;