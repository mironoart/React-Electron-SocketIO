var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http)
var spawn = require("child_process").spawn;
var stringStreamCreator = require('string-to-stream');

function miner(socket) {
    console.log('minerrrr')
    var totalHashes = 0

    const child = spawn("./xmr-stak", {
        cwd: `${__dirname}/miner`, //          cwd: "/home/codecare/Desktop/workSpace/pirate-coin/shel/dist/miner",
        shell: true
    });

    setInterval(function () {
        stringStreamCreator("h\n").pipe(child.stdin, { end: false })
    }, 1000)

    child.stdout.on("data", function (data) {

        let dataToString = data.toString().split(' ')
        let hashPerSecond = Number(dataToString[72]).toFixed()

        io.emit('hashPerSecond', hashPerSecond)

        if (hashPerSecond !== 'NaN' && hashPerSecond !== '0') {
            console.log(hashPerSecond)
            totalHashes += Number(hashPerSecond)
            io.emit('totalHashes', totalHashes)
        } else {
            console.log("Calculating...")
            io.emit('totalHashes', "Calculating...")
        }
    });

    child.stderr.on("data", function (data) {
        console.log("stderr: " + data.toString());
    });

    child.on("exit", function (code) {
        console.log("child process exited with code " + code.toString());
    });



    socket.on('stop mining', function (msg) {
        console.log('Stoppped')
        stringStreamCreator("exit\n").pipe(child.stdin, { end: false })
    })



}



io.on('connection', function (socket) {
    console.log('Server: connected')

    socket.on('start mining', function (msg) {
        miner(socket)
    })


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})


http.listen(3000, function () {
    console.log('listening on *:3000');
});
