const express = require('express');
const app = express();
const helmet =require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var hpp = require('hpp');
const cors = require("cors");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit')
const error = require('./middleware/error');
const bootcampRouter = require('./routes/bootcamp');
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');

mongoose.connect("mongodb+srv://root12345678:root12345678@newcluster.hds78.mongodb.net/My_TeachingSystem", {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log("Connected to MongoDB")
});

const port = 7000

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));


app.enable("trust proxy");
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,   // 10 minutes 
    max: 100  // 100 requests
});
//  apply to all requests
app.use(limiter);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Both allowDots and replaceWith
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  }),
);


//app.use(mongoSanitize());
app.use(hpp());


app.use('/api/auth', userRouter);
app.use('/bootcamp', bootcampRouter);
app.use('/api', courseRouter);
app.use(error);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

