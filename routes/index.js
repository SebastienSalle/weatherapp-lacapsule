const express = require('express');
const router = express.Router();
const request = require('sync-request');

const userModel = require('../models/users')

const appId = process.env.API_KEY;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/weather', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
  
  const user = await userModel.findOne({token: req.session.user.token})

  res.render('weather', {cityList: user.cities, username: user.username})
  }
});

router.post('/add-city', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
    
    const data = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=${appId}`) 
    const dataAPI = JSON.parse(data.body)

    const user = await userModel.findOne({token: req.session.user.token})
    const alreadyExist = user.cities.find( e => e.name.toLowerCase() === req.body.newcity.toLowerCase() );
    let cityList = user.cities
    if(alreadyExist === undefined && dataAPI.name){

      const previousCities = user.cities;
      const newCity = {
        name: dataAPI.name,
        apiId: dataAPI.id,
        desc:  dataAPI.weather[0].description,
        img: `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`,
        temp_min: dataAPI.main.temp_min,
        temp_max: dataAPI.main.temp_max,
        longitude: dataAPI.coord.lon, 
        latitude: dataAPI.coord.lat
      };

      await userModel.updateOne({token : req.session.user.token}, {cities: [...previousCities, newCity]})
      cityList = [...previousCities, newCity]
    }
    
    res.render('weather', {cityList, username: user.username})
  }
});

router.get('/delete-city', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
    const user = await userModel.findOne({token: req.session.user.token})
    const filteredCities = user.cities.filter(e => e._id != req.query.id)
    
    await userModel.updateOne({token: req.session.user.token}, {cities: [...filteredCities]})
    
    res.render('weather', {cityList: filteredCities, username: user.username})
  }
});

router.get('/update-cities', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
    const user = await userModel.findOne({token: req.session.user.token})
    const cityList = user.cities 
    
    for(let i = 0; i < cityList.length; i++){
      const cityName = cityList[i].name.toLowerCase();

      const data = request("GET", `https://api.openweathermap.org/data/2.5/weather?id=${cityList[i].apiId}&units=metric&lang=fr&appid=${appId}`) 
      const dataAPI = JSON.parse(data.body)

      cityList[i].name = cityList[i].name;
      cityList[i].apiId = cityList[i].apiId;
      cityList[i].desc =  dataAPI.weather[0].description;
      cityList[i].img = `http://openweathermap.org/img/wn/${dataAPI.weather[0].icon}.png`;
      cityList[i].temp_min = dataAPI.main.temp_min;
      cityList[i].temp_max = dataAPI.main.temp_max;
      
    }
    
    await userModel.updateOne({token: req.session.user.token},{cities : cityList})
    
    res.render('weather', {cityList: user.cities, username: user.username})
  }
});

router.get('/city-up', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
    const user = await userModel.findOne({token: req.session.user.token})
    const citiesOrder = user.cities;
    
    const goesUp = citiesOrder[req.query.place]
    const goesDown = citiesOrder[req.query.place - 1]
    
    const newCitiesOrder = [...citiesOrder];
    newCitiesOrder[req.query.place - 1] = goesUp
    newCitiesOrder[req.query.place] = goesDown
    
    await userModel.updateOne({token: req.session.user.token}, {cities: [...newCitiesOrder]})
    
    res.render('weather', {cityList: newCitiesOrder, username: user.username})
  }
});

router.get('/city-top', async function(req, res, next){
  if (req.session.user == null) {
    res.redirect("/");
  } else {
    const user = await userModel.findOne({token: req.session.user.token})
    const goesTop = user.cities[req.query.place]

    const filteredCities = user.cities.filter(e => e._id != req.query.id)

    const newCityList = [goesTop, ...filteredCities]

    await userModel.updateOne({token: req.session.user.token}, {cities: [...newCityList] })
  
    res.render('weather', {cityList: newCityList, username: user.username})
  }
});

module.exports = router;
