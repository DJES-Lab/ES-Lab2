var http = require('http');
var fs = require('fs');

// For using Redis with Node.js
// See https://github.com/mranney/node_redis
// Use `npm` command to install the package
// Like this: `npm install redis`
//
// See for what Redis can do
// http://redis.io/topics/data-types-intro
var redis = require('redis');
var redis_client = redis.createClient();

// # messages in the database
var messageNum;
redis_client.llen('all:messages', function(err, repl) {
  if (err) {
    res.writeHeader(500, { 'Content-Type': 'text/plain' });
    res.write('Internal Server Error');
    res.end();
  }
  else {
    messageNum = parseInt(repl);
  }
});



var getRequestHandler = function (req, res) {
  console.log('Got HTTP GET Request');
  res.writeHeader(200, { 'Content-Type': 'text/html' });
  res.write(fs.readFileSync('client.html'));
  res.end();
};

var postRequestHandler = function (req, res) {
  console.log('Got HTTP POST Request to ' + req.url);

  if (req.url === '/push') {

    var post_request_body = '';

    req.on('data', function (data) {
      post_request_body += data;
    });

    req.on('end', function (data) {
      var message = JSON.parse(post_request_body);
      redis_client.lpush('all:messages', messageNum + 1, function(err, repl) {
        if (err) {
          res.writeHeader(500, { 'Content-Type': 'text/plain' });
          res.write('Internal Server Error');
          res.end();
        } else {
          var objName = "message_" + (messageNum + 1);
          var date = new Date();
          redis_client.hmset(objName, "name", message.name, "input", message.input,
                             "time", date.toString(), function(err, repl) {
            if (err) {
              res.writeHeader(500, { 'Content-Type': 'text/plain' });
              res.write('Internal Server Error');
              res.end();
            } else {
              res.writeHeader(200, { 'Content-Type': 'text/html' });
              res.write('OK');
              res.end();
              messageNum += 1;
            }
          });
        }
      });
    });

  } else if (req.url === '/retrieve') {

    redis_client.SORT('all:messages', "LIMIT", 0, 10, "DESC", "GET", "message_*->name",
                      "GET", "message_*->input", "GET", "message_*->time", function(err, repl){
      if (err) {
        console.log('Error when reading from Redis', err);
        res.writeHeader(500, { 'Content-Type': 'text/plain' });
        res.write('Internal Server Error');
        res.end();
      } else {
        var len = repl.length / 3;
        var arr = new Array(len);
        for (var i = 0; i < len; i += 1) {
          arr[i] = {
            name: repl[3*i],
            input: repl[3*i + 1],
            time: repl[3*i + 2]
          };
        }
        res.writeHeader(200, { 'Content-Type': 'application/javascript' });
        res.write(JSON.stringify(arr));
        res.end();
      }
    });

  }
};

var server = http.createServer(function (req, res) {
  if (req.method === 'GET') {
    getRequestHandler(req, res);
  } else if (req.method === 'POST') {
    postRequestHandler(req, res);
  }
});

server.listen(1234, '127.0.0.1');
console.log('Server waiting for connection at http://127.0.0.1:1234/');
