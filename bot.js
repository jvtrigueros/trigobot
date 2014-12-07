var five = require('johnny-five')
  , Imp = require('imp-io')
  , keypress = require('keypress')
  , _ = require('lodash')
  , board
  , wheels
  , express = require('express')
  , app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var commandExecutor = function (req, res, fn) {
  res.send('up')
}
app.get('/up', up)

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

board = new five.Board({
  io: new Imp({agent: 'x68Gr1FhEmPr'}),
  repl: false
})

keypress(process.stdin);
process.stdin.on("keypress", _.bind(controller, wheels));
process.stdin.setRawMode(true);
process.stdin.resume();

function up() {
  wheels.both.cw()
}

function left() {
  wheels.right.cw()
}

function right() {
  wheels.left.cw()
}

function down() {
  wheels.both.ccw()
}

function stop() {
  wheels.both.stop()
}

function controller(ch, key) {
  if(key) {
    console.log(key.name)
    if (key.name === 'escape') {
      process.exit()
    }

    switch(key.name) {
      case 'up':
        up();
        break

      case 'left':
        left();
        break;

      case 'right':
        right();
        break;

      case 'down':
        down();
        break;

      case 'space':
        stop();
        break;
    }
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