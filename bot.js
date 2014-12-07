var five = require('johnny-five')
  , keypress = require('keypress')
  , board
  , wheels

board = new five.Board({
  io: new Imp({agent: 'x68Gr1FhEmPr'}),
  repl: false
})

board.on("ready", function () {

  keypress(process.stdin);
  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  function controller(ch, key) {
    if(key) {
      console.log(key.name)
      if(key.name === 'escape') {
        process.exit()
      }

      if(key.name === 'up')
        wheels.both.cw()
      else if(key.name === 'down')
        wheels.both.stop()
    }
  }

  wheels = {}

  // Create two servos as our wheels
  wheels.left = new five.Servo({
    pin: 9,
    type: "continuous"
  })

  wheels.right = new five.Servo({
    pin: 10,
    type: "continuous",
    isInverted: true // one wheel mounted inverted of the other
  })

  wheels.both = new five.Servos().stop() // reference both together

  // Add servos to REPL (optional)
//  this.repl.inject({
//    wheels: wheels
//  })

  // Drive forwards
  // Note, cw() vs ccw() might me different for you
  // depending on how you mount the servos
//  wheels.both.cw()
})