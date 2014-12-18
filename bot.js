var five = require('johnny-five')
  , Imp = require('imp-io')
  , _ = require('lodash')
  , express = require('express')
  , app = express()
  , socketsServer = require('http').Server(app)
  , io = require('socket.io')(socketsServer)
  , board
  , wheels
  ;

app.use(express.static(__dirname + '/robot'))
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.get('/', function (req, res) {
  res.send('Hello World!')
})

io.on('connection', function (socket) {
  socket.emit('command', { hello: 'world' })

  socket.on('command', function (data) {
    console.log('Command Received', data.command)
    commandSelector(data.command)
  })
})

var server = socketsServer.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

board = new five.Board({
  io: new Imp({agent: 'x68Gr1FhEmPr'}),
  repl: false
})

function commandSelector(cmd) {
  wheels.both.stop()
  switch (cmd) {
    case 'up':
      wheels.both.cw()
      break

    case 'left':
      wheels.right.cw()
      break;

    case 'right':
      wheels.left.cw()
      break;

    case 'down':
      wheels.both.ccw()
      break;

    case 'stop':
      wheels.both.stop()
      break;
  }
}

board.on("ready", function () {
  wheels = {};

  // Create two servos as our wheels
  wheels.left = new five.Servo({
    pin: 8,
    type: "continuous"
  });

  wheels.right = new five.Servo({
    pin: 9,
    type: "continuous",
    isInverted: true // one wheel mounted inverted of the other
  });

  wheels.both = new five.Servos().stop() // reference both together

})

exports.wheels = wheels