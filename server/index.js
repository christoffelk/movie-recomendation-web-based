const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { userRoutes, adminRoutes, movieRoutes, ratingRoutes } = require('./routers');


app.use(bodyParser.json({extended : true}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
// app.use('/module', moduleRoutes);
app.use('/movie', movieRoutes);
app.use('/rating', ratingRoutes);

//Static File
// app.use(express.static('public'));

app.listen(PORT, async () => {
    console.log(process.env.NODE_ENV);
    console.log("Server dah jalan di : http://localhost:"+PORT);
})


