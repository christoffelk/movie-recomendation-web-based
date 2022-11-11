const { TOTAL_CLUSTER } = require('../constants/general');
const { Movie, Rating, Genre } = require('../models');
const  { OK, INTERNAL_ERROR, NOT_FOUND  } = require('../constants/responseCode');
const math = require('mathjs');
const tf = require('@tensorflow/tfjs');

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
        const ratings = await Rating.findAll();
        const movies = await Movie.findAll();
        const mapMovies = mappingMovies(movies);
        // const genres = await Genre.findAll();

        //Generate nilai random matriks untuk jumlah data x cluster
        const epsilon = 1e-5;
        const maxIter = 150;
        const totalCluster = 5; //total rating 0.5 1 1.5 2 ....
        const initialPointData = {};
        const randomMatrix = {}; //cluster x jumlah data
        const clusterUsers = {};
        const matrixDivided = {};
        for(let i=0; i<ratings.length;i++){
            const userId = ratings[i]['UserId'];
            const rating = ratings[i]['Rating'];
            const movieId = ratings[i]['MovieId'];

            if(!initialPointData[userId]){
                initialPointData[userId] = {};
                randomMatrix[userId] = {};
                clusterUsers[userId] = {};
                matrixDivided[userId] = {};
            }

            if(!initialPointData[userId][movieId]){
                initialPointData[userId][movieId] = [];
                randomMatrix[userId][movieId] = [];
                clusterUsers[userId][movieId] = {};
                matrixDivided[userId][movieId] = null;
            }

            initialPointData[userId][movieId] = rating;
            let tempArr = [];
            let maximum = 1;
            let sumRowRandomNumber = 0;
            for(let j=0; j< totalCluster;j++){
                const randomNumber = parseFloat((Math.random() * maximum).toFixed(5));
                tempArr.push(randomNumber);
                sumRowRandomNumber += randomNumber
            }
            tempArr = tempArr.map(value => value/sumRowRandomNumber);
            randomMatrix[userId][movieId].push(...tempArr);
            const min = Math.min(...tempArr);

            clusterUsers[userId][movieId] = { 
                cluster: 'C' + (randomMatrix[userId][movieId].findIndex( value => value == min) + 1),
                value : min 
            };   
        }

        let start = true;
        let iteration = 1;
        const centroids = {};
        const euclidiens = {};
        const m = 3;
        for(let iter=0;iter<maxIter;iter++){
            console.log('Iterasi ',iteration);
            // Hitung centroid
            for(let j=0;j<totalCluster;j++){
                let pembilang = 0;
                let penyebut = 0;

                for(let i=0;i<ratings.length;i++){
                    const userId = ratings[i]['UserId'];
                    const movieId = ratings[i]['MovieId'];

                    const xi = parseFloat(initialPointData[userId][movieId]);
                    const Uijsquare = Math.pow(parseFloat(randomMatrix[userId][movieId][j]),m);
                    
                    pembilang += (xi * Uijsquare);
                    penyebut += Uijsquare;
                }

                centroids['C'+(j+1)] = pembilang/penyebut;
            }

            //Euclidien Distance
            for(let i=0;i<ratings.length;i++){
                const userId = ratings[i]['UserId'];
                const movieId = ratings[i]['MovieId'];

                if(!euclidiens[userId]){
                    euclidiens[userId] = {};
                }

                if(!euclidiens[userId][movieId]){
                    euclidiens[userId][movieId] = {};
                }
                
                for(let c=0;c<Object.keys(centroids).length;c++){
                    euclidiens[userId][movieId]['C'+(c+1)] = Math.sqrt(Math.pow(centroids['C'+(c+1)] - initialPointData[userId][movieId],2));
                }
            }

            const matrixError = [];
            
            //update bilangan matrix 
            for(let c=0;c<totalCluster;c++){
                matrixError[c] = [];
                for(let i=0;i<ratings.length;i++){
                    const userId = ratings[i]['UserId'];
                    const movieId = ratings[i]['MovieId'];

                    // let pembilang = Math.pow((1/euclidiens[userId][movieId]['C'+(c+1)]),1/(m-1));
                    let penyebut = 0;
                    let temp = randomMatrix[userId][movieId][c];
                    for(let k=0;k<totalCluster;k++){
                        penyebut += Math.pow((euclidiens[userId][movieId]['C'+(c+1)]/euclidiens[userId][movieId]['C'+(k+1)]),2/(m-1));
                    }

                    randomMatrix[userId][movieId][c] = 1/penyebut;
                    temp = randomMatrix[userId][movieId][c] - temp;
                    matrixError[c].push(temp);
                }
            }

            //Check apakah ada perpindahan cluster atau tidak
            // jika tidak ada perpindahan cluster lagi maka iterasi berhenti
            let stop = true;
            for(let i=0;i<ratings.length;i++){
                const userId = ratings[i]['UserId'];
                const movieId = ratings[i]['MovieId'];

                const min = Math.min(...randomMatrix[userId][movieId]);

                clusterUsers[userId][movieId] = { 
                    cluster: 'C' + (randomMatrix[userId][movieId].findIndex( value => value == min) + 1),
                    value : min 
                };
            }
            let Norm = tf.tensor2d(matrixError);
            console.log(Norm.norm().dataSync()[0] < epsilon);
            console.log(Norm.norm().dataSync()[0]);
            if(Norm.norm().dataSync()[0] < epsilon){
                break;
            }
            iteration++;
        }

        res.status(OK).send(JSON.stringify(centroids));

    } catch (err) {
        console.log(err);
        res.sendStatus(INTERNAL_ERROR);
    }
}

//item based collaborative filtering

module.exports = { FCM }