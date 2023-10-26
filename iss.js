const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
    request('https://api.ipify.org?format=json', (error, response, body) => {
        if (error) return callback(error, null);

        if (response.statusCode !== 200) {
            callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
            return;
        }

        const ip = JSON.parse(body).ip;
        callback(null, ip);
    });
}

const fetchCoordsByIP = function (ip, callback) {
    request(`http://ipwho.is/${ip}`, (error, response, body) => {
        if (error) return callback(error, null);

        const data = JSON.parse(body)

        if (!data.success) {
            const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
            callback(message, null);
            return;
        }

        const { latitude, longitude } = data;
        callback(null, { latitude, longitude });

    });
}

const fetchISSFlyOverTimes = function (coords, callback) {
    const { latitude, longitude } = coords
    const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
    request(url, (error, response, body) => {
        const message = `invalid ${latitude} and/or ${longitude} data to the request`;
        if (error) return callback(error, null);
        
        if (body === "invalid coordinates") return callback(message, null);

        const data = JSON.parse(body)
        if (response.statusCode !== 200 ) {
           
            callback(message, null);
            return;
        }

        callback(null, data.response);

    });
};

const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };