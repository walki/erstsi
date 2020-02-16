const express = require('express');
const app = express();
const bp = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const dbUri =
    'mongodb+srv://' +
    process.env.MONGOATLAS_DB_USER +
    ':' +
    encodeURIComponent(process.env.MONGOATLAS_DB_PW) +
    '@' +
    process.env.MONGOATLAS_DB_SRV +
    '.mongodb.net/' +
    process.env.MONGOATLAS_DB_APPNAME +
    '?retryWrites=true&w=majority';

mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to DB!');
    })
    .catch(err => {
        console.log('ERROR:', err.message);
    });



app.get('/', (req, res) => {
    res.render('home');
})


app.listen(PORT, () => {
    console.log(
            'Server has started on port ' +
            PORT
    );
});
