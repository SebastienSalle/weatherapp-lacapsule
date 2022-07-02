const express = require('express');
const router = express.Router();
const request = require('sync-request');
//var request = require('then-request');

const cityModel = require('../models/cities')

const appId = process.env.API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/weather', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
  const cityList = await cityModel.find();

  res.render('weather', {cityList})
  }
});

router.post('/add-city', async function(req, res, next){
  const data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=${appId}`) 
  const dataAPI = JSON.parse(data.body)

  const alreadyExist = await cityModel.findOne({ name: req.body.newcity.toLowerCase() });

  if(alreadyExist == null && dataAPI.name){
    const newCity = new cityModel({
      name: req.body.newcity.toLowerCase(),
      desc:  dataAPI.weather[0].description,
      img: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`,
      temp_min: dataAPI.main.temp_min,
      temp_max: dataAPI.main.temp_max,
      longitude: dataAPI.coord.lon, 
      latitude: dataAPI.coord.lat
    });

    await newCity.save();
  }
//
  const cityList = await cityModel.find();

  res.render('weather', {cityList})
});

router.get('/delete-city', async function(req, res, next){

  await cityModel.deleteOne({
    _id: req.query.id
  })

  const cityList = await cityModel.find();

  res.render('weather', {cityList})
});

router.get('/update-cities', async function(req, res, next){
  const cityList = await cityModel.find();

  for(let i = 0; i < cityList.length; i++){
    const data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&units=metric&lang=fr&appid=${appId}`) 
    const dataAPI = JSON.parse(data.body)

    await cityModel.updateOne({
      _id: cityList[i].id
    }, {
      name: cityList[i].name,
      desc:  dataAPI.weather[0].description,
      img: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`,
      temp_min: dataAPI.main.temp_min,
      temp_max: dataAPI.main.temp_max,
      // longitude: dataAPI.coord.lon, 
      // latitude: dataAPI.coord.lat
    });
  }

  res.render('weather', {cityList})
});



module.exports = router;
