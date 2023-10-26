const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP("174.93.83.11",(error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log(coordinates);
});


fetchISSFlyOverTimes({ latitude: 43.653226, longitude: -79.3831843 }, (error, risetime) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log(risetime);
})


const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});





