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
        const totalCluster = 3; //total rating 0.5 1 1.5 2 ....
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
            const tempArr = new Array(totalCluster);
            let maximum = 1;
            let totalFilled = 1;
            for(let j=0; j< totalCluster;j++){
                let randomIndex =  Math.floor(Math.random() * totalCluster);
                while(tempArr[randomIndex] != undefined && totalFilled != totalCluster){
                    randomIndex = Math.floor(Math.random() * totalCluster);
                    if(tempArr[randomIndex] == undefined){
                        totalFilled++;
                    }
                }

                const randomNumber = Math.random() * maximum;
                maximum -= randomNumber;
                tempArr[randomIndex] = randomNumber.toFixed(3);
            }

            const min = Math.min(...tempArr);

            clusterUsers[userId][movieId] = { 
                cluster: 'C' + (tempArr.findIndex( value => value == min) + 1),
                value : min 
            };
            randomMatrix[userId][movieId].push(...tempArr);
        }
        

        let start = true;
        let iteration = 1;
        const clusters = {};
        const euclidiens = {};
        const m = 3;
        while(start){
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

                clusters['C'+(j+1)] = pembilang/penyebut;
            }

            console.log(clusters);

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

                    // let pembilang = Math.pow((1/euclidiens[userId][movieId]['C'+(c+1)]),1/(m-1));
                    let penyebut = 0;
                    
                    for(let k=0;k<totalCluster;k++){
                        penyebut += Math.pow((euclidiens[userId][movieId]['C'+(c+1)]/euclidiens[userId][movieId]['C'+(k+1)]),2/(m-1));
                    }

                    randomMatrix[userId][movieId][c] = 1/penyebut;
                }
            }
        

            //Check apakah ada perpindahan cluster atau tidak
            // jika tidak ada perpindahan cluster lagi maka iterasi berhenti

            const oldClusterUsers = clusterUsers;
            let stop = true;
            for(let i=0;i<ratings.length;i++){
                const userId = ratings[i]['UserId'];
                const movieId = ratings[i]['MovieId'];

                const min = Math.min(...randomMatrix[userId][movieId]);

                clusterUsers[userId][movieId] = { 
                    cluster: 'C' + (randomMatrix[userId][movieId].findIndex( value => value == min) + 1),
                    value : min 
                };

                if(oldClusterUsers[userId][movieId]['cluster'] != clusterUsers[userId][movieId]['cluster']){
                    console.log("Tidak sama");
                    stop = false;
                }
            }
            if(stop){
                start = false;
            }
            iteration++;
        }

        console.log(clusters);
        res.status(OK).send(JSON.stringify(randomMatrix));

    } catch (err) {
        console.log(err);
        res.sendStatus(INTERNAL_ERROR);
    }
}

module.exports = { FCM }