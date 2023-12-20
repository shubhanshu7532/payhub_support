require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');

const keys = require('../config/keys');
const { database } = keys;

const setupDB = async () => {
  try {
    // Connect to MongoDB
    mongoose.set('useCreateIndex', true);
    mongoose
      .connect(database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then((con) =>
        console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)

      )
      .catch(err => console.log(err));

    // const conn = mongoose.connection;
    // let gfs;

    // conn.once('open', () => {
    //   console.log('MongoDB connected');
    //   gfs = Grid(conn.db, mongoose.mongo);
    //   gfs.collection('uploads');
    // });
  } catch (error) {
    return null;
  }
};



module.exports = setupDB;
