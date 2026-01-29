const express =require ('express');
const router=express.Router();
const{getQuizResults,getQuizQuestions,updateQuizDetails,getQuizDetails,adminLogin, updateQuizQuestions}=require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
router.post('/login',adminLogin);
router.get('/check-auth',[authenticate],(req,res)=>{
    res.status(200).json({
        message:'User is authenticated',
        user:req.user
    });
});
router.get('/results',[authenticate],getQuizResults);
router.get('/questions',[authenticate],getQuizQuestions);
router.put('/questions',[authenticate],updateQuizQuestions);
router.get('/basic-details',[authenticate],getQuizDetails);
router.put('/basic-details',[authenticate],updateQuizDetails);
module.exports=router;