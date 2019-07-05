if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const databaseURL = ``;
const port = process.env.PORT || 3000;

const routes = require('./routes');

let databaseUrl = '';

if (process.env.NODE_ENV === 'test') {
  databaseUrl = process.env.DATABASE_URL_TEST;
} else if (process.env.NODE_ENV === 'development') {
  databaseUrl = process.env.DATABASE_URL_DEVELOPMENT;
} else if(process.env.NODE_ENV === 'production') {
  databaseUrl = process.env.DATABASE_URL_PRODUCTION
}

mongoose.connect(databaseURL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((err) => {
    console.log(err);
  });
  
app.use(cors()); 
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/', routes);

app.use(function (err, req, res, next) {

  console.log(err);
  if (err.code === 404) {
    res.status(404).json({
      message: 'Resource not found',
      code: 404
    });
  } else if (err.code === 401) {
    res.status(401).json({
      message: 'Do not have access',
      code: 401
    });
  } else if (err.name == 'ValidationError') {
    res.status(422).json(err);
  } else {
    res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`listen to port ${port}`);
})