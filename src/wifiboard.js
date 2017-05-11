var robot = require('robotjs');
var net = require('net');
var keycode = require('keycode');
var dgram = require('dgram');

var TCP_PORT = 8989;
var delimiter = "//";
var end_of_command = "///";
var delim_coord = ";";

robot.setMouseDelay(5);

var server = net.createServer(function(socket) {

    console.log("Client connected")

    socket.on('data', function(data) {

        var chunk = "" + data.toString();
        //console.log("Data received: " + chunk);

        var index = chunk.indexOf(delimiter);
        //console.log("Command: " + chunk.substring(0, index));
        console.log("Command: " + chunk);
        switch (chunk.substring(0, index)) {
            case "SEND_KEYCODE":
                //console.log("SEND_KEYCODE Char: " + chunk.charAt(index + delimiter.length));
                robot.typeString(chunk.charAt(index + delimiter.length));
                //pressUnicode(chunk.charAt(index + delimiter.length))
                break;
            case "SEND_KEYEVENT":
                robot.keyTap(chunk.substring(index + delimiter.length, chunk.indexOf(end_of_command)));
                break;

            case "SEND_MOUSE_MOVE":
                var nowY = robot.getMousePos().y;
                var nowX = robot.getMousePos().x;

                var newX = parseFloat(chunk.substring(index + delimiter.length, chunk.indexOf(delim_coord)));
                var newY = parseFloat(chunk.substring(chunk.indexOf(delim_coord) + 1));

                robot.moveMouseSmooth(nowX + newX, nowY + newY);
                break;
            case "SEND_MOUSE_CLICK":
                robot.mouseClick("left");
        }
    })
});
// listen on the specified port
server.listen(TCP_PORT);