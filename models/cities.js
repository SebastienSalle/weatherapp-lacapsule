const mongoose = require('mongoose')

const citySchema = mongoose.Schema({
    name: String,
    desc: String,
    img: String,
    temp_min: Number,
    temp_max: Number,
    longitude: Number,
    latitude: Number
})

const cityModel = mongoose.model('cities', citySchema)

module.exports = cityModel;