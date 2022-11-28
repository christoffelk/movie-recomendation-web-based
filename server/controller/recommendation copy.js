const { TOTAL_CLUSTER } = require('../constants/general');
const { Movie, Rating, ClusterFormation, Centroid } = require('../models');
const  { OK, INTERNAL_ERROR, NOT_FOUND  } = require('../constants/responseCode');
const math = require('mathjs');
const tf = require('@tensorflow/tfjs');
const epsilon = 1e-4;
let maxIter = 150;
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
            ratings = req.body.ratings;
        }else{
            ratings = await Rating.findAll();
        }
        
        const movies = await Movie.findAll({
            group: 'MovieId',
            attributes: [
                'MovieId',
                [Sequelize.fn('AVG', Sequelize.col('Rating')), 'avgRating']
            ]
        });
        // const mapMovies = mappingMovies(movies);
        // const genres = await Genre.findAll();

        //Generate nilai random matriks untuk jumlah data x cluster
        //total rating 0.5 1 1.5 2 ....
        const initialPointData = {};
        const randomMatrix = {}; //cluster x jumlah data
        const clusterUsers = {};
        for(let i=0; i<ratings.length;i++){
            const userId = ratings[i]['UserId'];
            const rating = ratings[i]['Rating'];
            const movieId = ratings[i]['MovieId'];

            if(!initialPointData[userId]){
                initialPointData[userId] = {};
                randomMatrix[userId] = [];
                clusterUsers[userId] = {};
            }

            if(!initialPointData[userId][movieId]){
                initialPointData[userId][movieId] = 0;
            }

            initialPointData[userId][movieId] = rating;
            let tempArr = [];
            let maximum = 1;
            let sumRowRandomNumber = 0;
            if(randomMatrix[userId].length == 0){
                for(let j=0; j< totalCluster;j++){
                    const randomNumber = parseFloat((Math.random() * maximum).toFixed(5));
                    tempArr.push(randomNumber);
                    sumRowRandomNumber += randomNumber
                }
                tempArr = tempArr.map(value => value/sumRowRandomNumber);
                randomMatrix[userId].push(...tempArr);
                const max = Math.max(...tempArr);

                clusterUsers[userId] = { 
                    cluster: 'C' + (randomMatrix[userId].findIndex( value => value == max) + 1),
                    value : max 
                };   
            }
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
            
            //update bilangan matrix 
            for(let c=0;c<totalCluster;c++){
                matrixError[c] = [];
                for(let i=0;i<Object.keys(initialPointData).length;i++){
                    const userId = Object.keys(initialPointData)[i];

                    let penyebut = 0;
                    let temp = randomMatrix[userId][c];
                    for(let k=0;k<totalCluster;k++){
                        penyebut += Math.pow((euclidiens[userId]['C'+(c+1)]/euclidiens[userId]['C'+(k+1)]),2/(m-1));
                    }

                    randomMatrix[userId][c] = 1/penyebut;
                    temp = randomMatrix[userId][c] - temp;
                    matrixError[c].push(temp);
                }
            }
            // console.log(randomMatrix);  

            //Check apakah ada perpindahan cluster atau tidak
            // jika tidak ada perpindahan cluster lagi maka iterasi berhenti
            let stop = true;
            for(let i=0;i<Object.keys(initialPointData).length;i++){
                const userId = ratings[i]['UserId'];

                const max = Math.max(...randomMatrix[userId]);

                clusterUsers[userId] = { 
                    cluster: 'C' + (randomMatrix[userId].findIndex( value => value == max) + 1),
                    value : max 
                };
            }
            let Norm = tf.tensor2d(matrixError);
            let normValue = Norm.norm().dataSync()[0];
            if(normValue < epsilon){
                // updateClusteringToDb(randomMatrix);
                break;
            }
            iteration++;
        }

        res.status(OK).send(JSON.stringify(clusterUsers));

    } catch (err) {
        console.log(err);
        res.sendStatus(INTERNAL_ERROR);
    }
}

const averageUserRated = (initialPointData) => {
    let averageRated = {};
    for(let i=0;i<Object.keys(initialPointData).length;i++){        
        const userId = Object.keys(initialPointData)[i];
        const movieIds = Object.keys(initialPointData[userId]);
        const totalMoviesRated = Object.keys(initialPointData[userId]).length;

        if(!averageRated[userId]){
            averageRated[userId] = 0;
        }

        for(let k=0;k<totalMoviesRated;k++){
            averageRated[userId] += parseFloat(initialPointData[userId][movieIds[k]]);
        }

        averageRated[userId] /= totalMoviesRated;
    }

    return averageRated;
}


const euclidienDistance = (ratings, centroids, initialPointData) => {
    try {
        let euclidiens = {};
        let averageRatings = averageUserRated(initialPointData);
        const userIds = Object.keys(initialPointData);
        for(let i=0;i<userIds.length;i++){
            const userId = userIds[i];
            const movieIds = Object.keys(initialPointData[userId]);

            if(!euclidiens[userId]){
                euclidiens[userId] = {};
            }
            
            for(let c=0;c<Object.keys(centroids).length;c++){
                // let temp = 0;
                // for(let k=0;k<movieIds.length;k++){
                //     temp += Math.pow(centroids['C'+(c+1)] - initialPointData[userId][movieIds[k]],2);
                // }
                // euclidiens[userId]['C'+(c+1)] = Math.sqrt(temp);
                euclidiens[userId]['C'+(c+1)] = Math.sqrt(Math.pow(centroids['C'+(c+1)] - averageRatings[userId],2));
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
        let averageRatings = averageUserRated(initialPointData);
        for(let j=0;j<totalCluster;j++){
            let pembilang = 0;
            let penyebut = 0;

            for(let i=0;i<Object.keys(initialPointData).length;i++){
                const userId = Object.keys(initialPointData)[i];
                xi = averageRatings[userId];
                const Uijsquare = Math.pow(parseFloat(randomMatrix[userId][j]),m);
                
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