const { TOTAL_CLUSTER } = require('../constants/general');
const { Sequelize } = require('sequelize');
const { Movie, Rating, ClusterFormation, Centroid } = require('../models');
const  { OK, INTERNAL_ERROR, NOT_FOUND  } = require('../constants/responseCode');
const math = require('mathjs');
const tf = require('@tensorflow/tfjs');
const epsilon = 1e-2;
let maxIter = 1000;
let totalCluster = 5;
let m = 3;


const mappingMovies = (movies) => {
    const mapping = {};

    movies.forEach(movie => {
        mapping[movie['MovieId']] = movie['Genres'] == null ? 0 : movie['Genres'].length
    });

    return mapping;
}

//fuzzy c-means
const FCM = async (req, res) => {
    try {
        let ratings = [];
        if(req.body.m) {
            m = req.body.m;
        }

        if(req.body.totalCluster){
            totalCluster = req.body.totalCluster;
        }

        if(req.body.maxIter) {
            maxIter = req.body.maxIter;
        }

        if(req.body.ratings){
            const data = req.body.ratings;
            
            for(let i=0;i<data.length;i++){
                ratings[i]
            }

        }else{
            ratings = await Rating.findAll({
                group: 'MovieId',
                attributes: [
                    'MovieId',
                    [Sequelize.fn('AVG', Sequelize.col('Rating')), 'avgRating']
                ]
            });
        }
        
        const movies = await Movie.findAll();
        // const mapMovies = mappingMovies(movies);
        // const genres = await Genre.findAll();

        //Generate nilai random matriks untuk jumlah data x cluster
        //total rating 0.5 1 1.5 2 ....
        const initialPointData = {};
        const randomMatrix = {}; //cluster x jumlah data
        const clusterMovie = {};

        for(let i=0; i<ratings.length;i++){
            const avgRating = ratings[i]['dataValues']['avgRating'] ? ratings[i]['dataValues']['avgRating'] : ratings[i]['avgRating'];
            const movieId = ratings[i]['dataValues']['MovieId'] ? ratings[i]['dataValues']['MovieId'] : ratings[i]['dataValues']['MovieId'];

            if(!initialPointData[movieId]){
                initialPointData[movieId] = {};
                randomMatrix[movieId] = [];
                clusterMovie[movieId] = {};
            }

            initialPointData[movieId] = parseFloat(avgRating);
            let tempArr = [];
            let maximum = 1;
            let sumRowRandomNumber = 0;
            
            for(let j=0; j< totalCluster;j++){
                const randomNumber = parseFloat((Math.random() * maximum).toFixed(5));
                tempArr.push(randomNumber);
                sumRowRandomNumber += randomNumber
            }
            tempArr = tempArr.map(value => value/sumRowRandomNumber);
            randomMatrix[movieId].push(...tempArr);
            const max = Math.max(...tempArr);

            clusterMovie[movieId] = { 
                cluster: 'C' + (randomMatrix[movieId].findIndex( value => value == max) + 1),
                value : max 
            };   
        }

        let start = true;
        let iteration = 1;
        let centroids = {};
        let euclidiens = {};
        for(let iter=0;iter<maxIter;iter++){
            console.log('Iterasi ',iteration);
            console.log(randomMatrix);
            // Hitung centroid
            centroids = centroidCluster(ratings, randomMatrix, initialPointData);
            console.log('Centroid '+iteration,centroids);
            //Euclidien Distance
            euclidiens = euclidienDistance(ratings,centroids,initialPointData);
            console.log('Euclidiens '+iteration,euclidiens);
            const matrixError = [];
            
            const movieIds = Object.keys(initialPointData);
            //update bilangan matrix 
            for(let c=0;c<totalCluster;c++){
                matrixError[c] = [];
                for(let i=0;i<movieIds.length;i++){
                    const movieId = movieIds[i];

                    let penyebut = 0;
                    let temp = randomMatrix[movieId][c];
                    for(let k=0;k<totalCluster;k++){
                        penyebut += Math.pow((euclidiens[movieId]['C'+(c+1)]/euclidiens[movieId]['C'+(k+1)]),2/(m-1));
                    }

                    randomMatrix[movieId][c] = 1/penyebut;
                    temp = Math.abs(randomMatrix[movieId][c] - temp);
                    matrixError[c].push(temp);
                }
            }
            // console.log(randomMatrix);  

            //Check apakah ada perpindahan cluster atau tidak
            // jika tidak ada perpindahan cluster lagi maka iterasi berhenti
            let stop = true;
            for(let i=0;i<movieIds.length;i++){
                const movieId = movieIds[i];

                const max = Math.max(...randomMatrix[movieId]);

                clusterMovie[movieId] = { 
                    cluster: 'C' + (randomMatrix[movieId].findIndex( value => value == max) + 1),
                    value : max 
                };
            }

            // console.log(matrixError);
            let Norm = tf.tensor2d(matrixError);
            let normValue = Norm.norm().dataSync()[0];
            console.log(normValue);
            if(normValue < epsilon){
                // updateClusteringToDb(randomMatrix);
                break;
            }
            iteration++;
        }

        res.status(OK).send(JSON.stringify(clusterMovie));

    } catch (err) {
        console.log(err);
        res.sendStatus(INTERNAL_ERROR);
    }
}

const euclidienDistance = (ratings, centroids, initialPointData) => {
    try {
        let euclidiens = {};
        const movieIds = Object.keys(initialPointData);
        for(let i=0;i<movieIds.length;i++){
            const movieId = movieIds[i];

            if(!euclidiens[movieId]){
                euclidiens[movieId] = {};
            }
            
            for(let c=0;c<Object.keys(centroids).length;c++){
                euclidiens[movieId]['C'+(c+1)] = Math.sqrt(Math.pow(centroids['C'+(c+1)] - initialPointData[movieId],2));
            }
        }

        return euclidiens;
    } catch (err) {
        console.log(err);
    }
}

const centroidCluster = (ratings, randomMatrix, initialPointData) => {
    try {
        let centroids = {};
        const movieIds = Object.keys(initialPointData);
        for(let j=0;j<totalCluster;j++){
            let pembilang = 0;
            let penyebut = 0;

            
            for(let i=0;i<movieIds.length;i++){
                const movieId = movieIds[i];
                xi = initialPointData[movieId];
                const Uijsquare = Math.pow(parseFloat(randomMatrix[movieId][j]),m);
                
                pembilang += (xi * Uijsquare);
                penyebut += Uijsquare;
            }

            centroids['C'+(j+1)] = pembilang/penyebut;
        }

        return centroids;
    } catch (err) {
        console.log(err);
    }
}

const updateClusteringToDb = async (randomMatrix) => {
    try {
        let tempObject = [];
        let limit = 50;

        for(let i=0;i<Object.keys(randomMatrix).length;i++){
            const userId = Object.keys(randomMatrix)[i];

            const values = randomMatrix[userId];
            for(let k=0;k<values.length;k++){
                tempObject.push({
                    UserId : userId,
                    Cluster: k+1,
                    Value: values[k]
                });
            }
            if(tempObject.length >= limit){
                console.log(tempObject.length);
                const result = await ClusterFormation.bulkCreate(tempObject);
                tempObject = [];
            }
        }

        if(tempObject.length > 0){
            await ClusterFormation.bulkCreate(tempObject);
        }
        
    } catch (err) {
        console.log(err.message);
    }
}
//item based collaborative filtering

const IBCF = async (req, res) => {
    try {
        const { userId, movieId } = req.body;


        // find similarity between item rated by user and another item

        
        const userCluster = await ClusterFormation.findAll({
            where: {
                UserId: userId
            },
            order: [
                ['Values', 'ASC']
            ],
            limit : 1
        });

        // find users in the same clusters
        const userByCluster = await ClusterFormation.findAll({
            where: {
                Cluster: userCluster['Cluster']
            }
        });


    } catch (err) {
        
    }
}

module.exports = { FCM }