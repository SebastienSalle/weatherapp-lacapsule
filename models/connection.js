const mongoose = require('mongoose');

const name = process.env.USER_NAME;
const password = process.env.PASSWORD;

const options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect(`mongodb+srv://${name}:${password}@cluster0.xlgbyt1.mongodb.net/?retryWrites=true&w=majority`,
    options,
    function(err){
        console.log(err);
    }
)