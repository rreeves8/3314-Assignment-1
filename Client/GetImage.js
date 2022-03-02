let net = require("net");
let fs = require("fs");
let open = require('open')
let singleton = require('./Singleton')
//use argv to get the cmd line data
var argv = require('optimist').argv;
let client = new net.Socket();

let ITPpacket = require("./ITPRequest"); 

//check function for nicer looking code, to print right args
const check = (param, id) => {
    return (param === undefined) ? (id) : ('')
}

//check that all args are there
if (argv.s !== undefined && argv.i !== undefined && argv.v !== undefined && argv.p !== undefined) {
    const server = new String(argv.s.split(":")[0]).toString() //get server ip
    const port = new Number(argv.p).toPrecision() //get port
    const imageName = new String(argv.i).toString() //get imagename
    const versionNo = new Number(argv.v).toPrecision() //get versionno

    let packet = ITPpacket.getBytePacket(imageName, versionNo, singleton.getTimestamp()) //build the packet to send

    client.connect(port, server, () => {
        console.log("CONNECTED TO ImageDB Server on: " + server + ":" + port) 
        client.write(packet) //send the packet once connected
    });

    //wait for response
    client.on("data", (data) => {
        //log data
        console.log(
            "Server sent: \n " +
            "-- ITP version: " + data.readInt32BE(0, 4) + "\n " +
            "-- Response Type: " + data.readInt32BE(4, 8) + "\n " +
            "-- Sequence Number: " + data.readInt32BE(12, 20) + "\n " +
            "-- Timestamp: " + data.readInt32BE(32, 32) + "\n " +
            "-- Image Size: " + data.readInt32BE(64, 32)
        );

        //write the incoming image data to a file
        fs.writeFile("recieved_images/" + imageName, data.slice(96), err => {
            if (err) throw err;
        });

        //open the writted file
        open("recieved_images/" + imageName).then(err => {});

        //close
        client.destroy()
        console.log("Disconnected From Server")
    })

}
else { //if missing args report error
    console.log("missing parameters: " + check(argv.s, '-s server') + " " + check(argv.i, '-img image') + " " + check(argv.v, '-v version'))
}

