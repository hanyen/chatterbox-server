var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestGET = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  //npm install http-server -g
  //run http-server from client folder to render client files on server side

  var fs = require('fs');
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  var dataObject;
  
  dataObject = JSON.parse(fs.readFileSync('./data.json'));
  //content type being received and sent is application/json
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);
  //end the response and send back the dataObject to the client
  response.end(JSON.stringify(dataObject));
};

var requestPOST = function (request, response) {
  
  var fs = require('fs');
  var dataObject;
  dataObject = JSON.parse(fs.readFileSync('./data.json'));
  var body = '';
  var statusCode = 201;
  request.on('data', function (data) {
    body += data;
    console.log(body);
    //push to current data object
    dataObject.results.push(JSON.parse(body));
    //write to data.js file
    fs.writeFile('./data.json', JSON.stringify(dataObject), (err) => {
      if (err) { throw err; }
      console.log('It\'s saved!');
    });
    // Too much POST data, kill the connection!
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      request.connection.destroy();
    }
  });
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.

module.exports.requestGET = requestGET;
module.exports.requestPOST = requestPOST;