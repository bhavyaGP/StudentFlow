const mongoose = require('mongoose');
// require('dotenv').config();
const mongoUrl = 'mongodb://localhost:27017/myproject';
// const mongoUrl = process.env.mongoUrl ;
mongoose.set('strictQuery', true);

mongoose.connect(mongoUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});
db.on('error', (err) => {
    console.error('Error connecting to MongoDB', err);
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});
module.export = db;
