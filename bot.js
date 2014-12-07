var five = require('johnny-five')
  , Imp = require('imp-io')
  , keypress = require('keypress')
  , _ = require('lodash')
  , board
  , wheels

board = new five.Board({
  io: new Imp({agent: 'x68Gr1FhEmPr'}),
  repl: false
})

keypress(process.stdin);
process.stdin.on("keypress", _.bind(controller, wheels));
process.stdin.setRawMode(true);
process.stdin.resume();

function controller(ch, key) {
  if(key) {
    console.log(key.name)
    if (key.name === 'escape') {
      process.exit()
    }

    switch(key.name) {
      case 'up':
        wheels.both.cw()
        break
      case 'down':
        wheels.both.stop()
        break
    }
  }
}

board.on("ready", function () {
  wheels = {};

  // Create two servos as our wheels
  wheels.left = new five.Servo({
    pin: 8,
    type: "continuous",
    debug: true
  });

  wheels.right = new five.Servo({
    pin: 9,
    type: "continuous",
    isInverted: true, // one wheel mounted inverted of the other
    debug: true
  });

  wheels.both = new five.Servos().stop() // reference both together
  // Add servos to REPL (optional)
//  this.repl.inject({
//    wheels: wheels
//  })

  // Drive forwards
  // Note, cw() vs ccw() might me different for you
  // depending on how you mount the servos
})