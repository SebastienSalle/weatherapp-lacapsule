const express = require('express');
const router = express.Router();


const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const cost = 10;

const userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

    const searchUser = await userModel.findOne({
      email: req.body.emailFromFront
    })
  
  if(req.body.emailFromFront && !searchUser){
    const hash = bcrypt.hashSync(req.body.passwordFromFront, cost);

    const newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(36),
      cities: []
    })
  
    const newUserSave = await newUser.save();
  
    req.session.user = {
      name: newUserSave.username,
      token: newUserSave.token
    }
    
    res.redirect('/weather')
  } else {
    res.redirect('/')
  }
  
});

router.post('/sign-in', async function(req,res,next){


  const searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
  })

  if(searchUser!= null && bcrypt.compareSync(req.body.passwordFromFront, searchUser.password)){
    req.session.user = {
      name: searchUser.username,
      token: searchUser.token
    }
    res.redirect('/weather')
  } else {
    res.render('login')
  }

});

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.redirect('/')
});


module.exports = router;
