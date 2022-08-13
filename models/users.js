const mongoose = require('mongoose')

const citySchema = mongoose.Schema({
    name: String,
    apiId: Number,
    desc: String,
    img: String,
    temp_min: Number,
    temp_max: Number,
    longitude: Number,
    latitude: Number
})

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    cities: [citySchema],
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel;