const { TOTAL_CLUSTER } = require('../constants/general');
const { Movie, Rating, Genre } = require('../models');
const  { OK, INTERNAL_ERROR, NOT_FOUND  } = require('../constants/responseCode');

const mappingMovies = (movies) => {
    const mapping = {};

    movies.forEach(movie => {
        mapping[movie['MovieId']] = movie['Genres'] == null ? 0 : movie['Genres'].length
    });

    return mapping;
}


const FCM = async (req, res) => {
    try {
        const ratings = await Rating.findAll();
        const movies = await Movie.findAll();
        const mapMovies = mappingMovies(movies);
        // const genres = await Genre.findAll();

        //Generate nilai random matriks untuk jumlah data x cluster
        const totalCluster = 5; //total rating 0.5 1 1.5 2 ....
        const initialPointData = {};
        const randomMatrix = {}; //cluster x jumlah data
        const clusterUsers = {};
        for(let i=0; i<ratings.length;i++){
            const userId = ratings[i]['UserId'];
            const rating = ratings[i]['Rating'];
            const movieId = ratings[i]['MovieId'];

            if(!initialPointData[userId]){
                initialPointData[userId] = {};
                randomMatrix[userId] = {};
                clusterUsers[userId] = {};
            }

            if(!initialPointData[userId][movieId]){
                initialPointData[userId][movieId] = [];
                randomMatrix[userId][movieId] = [];
                clusterUsers[userId][movieId] = {};
            }

            initialPointData[userId][movieId] = rating;
            const tempArr = [];
            let maximum = 1;
            for(let j=0; j< totalCluster;j++){
                const randomNumber = Math.random() * maximum;
                maximum -= randomNumber;
                tempArr.push(randomNumber.toFixed(3));
            }

            const min = Math.min(...tempArr);

            clusterUsers[userId][movieId] = { 
                cluster:  tempArr.findIndex( value => value == min),
                value : min 
            };
            randomMatrix[userId][movieId].push(...tempArr);
        }
        return res.status(OK).send(JSON.stringify(clusterUsers));

        let start = true;
        let iteration = 1;
        while(start){
            console.log('Iterasi ',iteration);
            // Hitung centroid
            const clusters = {};
            const m = 2;
            for(let j=0;j<totalCluster;j++){
                let pembilang = 0;
                let penyebut = 0;
                for(let i=0;i<ratings.length;i++){
                    const userId = ratings[i]['UserId'];
                    const movieId = ratings[i]['MovieId'];

                    const xi = initialPointData[userId][movieId];
                    const Uijsquare = Math.pow(randomMatrix[userId][movieId][j],m);
                    
                    pembilang += (xi * Uijsquare);
                    penyebut += Uijsquare;
                }   
                clusters['C'+(j+1)] = pembilang/penyebut;
            }            

            //Euclidien Distance
            const euclidiens = {};
            for(let i=0;i<ratings.length;i++){
                const userId = ratings[i]['UserId'];
                const movieId = ratings[i]['MovieId'];

                if(!euclidiens[userId]){
                    euclidiens[userId] = {};
                }

                if(!euclidiens[userId][movieId]){
                    euclidiens[userId][movieId] = {};
                }
                
                for(let c=0;c<Object.keys(clusters).length;c++){
                    euclidiens[userId][movieId]['C'+(c+1)] = Math.sqrt(Math.pow(clusters['C'+(c+1)] - initialPointData[userId][movieId],2));
                }
            }
            
            const oldRandommatrix = randomMatrix;
            //update bilangan matrix 
            for(let c=0;c<totalCluster;c++){
                for(let i=0;i<ratings.length;i++){
                    const userId = ratings[i]['UserId'];
                    const movieId = ratings[i]['MovieId'];

                    let pembilang = Math.pow((1/euclidiens[userId][movieId]['C'+(c+1)]),1/(m-1));
                    let penyebut = 0;
                    
                    for(let k=0;k<totalCluster;k++){
                        penyebut += Math.pow((1/euclidiens[userId][movieId]['C'+(k+1)]),1/(m-1));
                    }

                    randomMatrix[userId][movieId][c] = pembilang/penyebut;
                }
            }



            //stop when ||new matrix(U k+1) - old matrix (U k)|| < epsilon
            for(let i=0;i<ratings.length;i++){
                for(let j=0;j<totalCluster;j++){
                    for(let k=0;k<totalCluster;k++){

                    }
                }
            }
            iteration++;
        }


        res.status(OK).send(JSON.stringify(randomMatrix));

    } catch (err) {
        console.log(err);
        res.sendStatus(INTERNAL_ERROR);
    }
}

module.exports = { FCM }