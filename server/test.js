const fs = require('fs');
const rawdata = fs.readFileSync('./assets/ratings.csv').toString();
const data = rawdata.split('\r\n');
let ratingsData = [];
for(let i=1; i<data.length ;i++){
    const splited = data[i].split(',');
    ratingsData[i] = {
    UserId: splited[0],
    MovieId: splited[1],
    Rating: splited[2]
    }

    if(ratingsData.length % 1000 == 0){
        console.log(ratingsData)
    // queryInterface.bulkInsert('Ratings', [ratingsData]);
    //reset
    ratingsData = [];
    }
}