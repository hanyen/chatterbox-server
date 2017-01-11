/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
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


  var url = require('url');
  var fs = require('fs');
  var path = url.parse(request.url).pathname;
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  var dataObject;
  dataObject = JSON.parse(fs.readFileSync('./data.json'));
  console.log(path);
  if (path === '/') {
    console.log('inside path root');
    fs.readFile('../client/index.html', function(err, data) {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data, function (error) {
        response.end();
      });
    });
  }
  //content type being received and sent is application/json
  headers['Content-Type'] = 'application/json';

  //if nonexistent endpoint is passed in
  // if (path !== '/classes/messages') {
  //   statusCode = 404;
  //   response.writeHead(statusCode, headers);
  //   response.end('nonexistent endpoint');

  // }

  //handle post requests
  if (request.method === 'POST') {
    var body = '';
    statusCode = 201;
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
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);
  //end the response and send back the dataObject to the client
  response.end(JSON.stringify(dataObject));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.

module.exports.requestHandler = requestHandler;

