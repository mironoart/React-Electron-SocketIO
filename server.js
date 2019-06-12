var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http)
var spawn = require("child_process").spawn;
var stringStreamCreator = require('string-to-stream');


function miner() {
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
        console.log(data.toString())
        /* 
                var hashesPerSecondPlaseholder = document.getElementById("hashesPerSecond")
                var totalHashesPlaseholder = document.getElementById("totalHashes")
        
        
                let dataToString = data.toString().split(' ')
                console.log(dataToString)
        
        
                let hashPerSecond = Number(dataToString[72]).toFixed()
                if (hashPerSecond !== 'NaN' && hashPerSecond !== '0') {
                    console.log(hashPerSecond)
                    hashesPerSecondPlaseholder.innerText = hashPerSecond;
                    totalHashes += Number(hashPerSecond)
                } else {
                    console.log("Calculating...")
                    hashesPerSecondPlaseholder.innerText = "Calculating...";
                }
        
                totalHashesPlaseholder.innerText = totalHashes
         */

    });

    child.stderr.on("data", function (data) {
        console.log("stderr: " + data.toString());
    });


    child.on("exit", function (code) {
        console.log("child process exited with code " + code.toString());
    });
}







io.on('connection', function (socket) {
    console.log('Server: connected')
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('chat message', function (msg) {
        miner()
        io.emit('message', msg)
    })
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})





http.listen(3000, function () {
    console.log('listening on *:3000');
});
