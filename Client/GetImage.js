let net = require("net");
let fs = require("fs");
let open = require('open')

var argv = require('optimist').argv;
let client = new net.Socket();

let ITPpacket = require("./ITPRequest"); // uncomment this line after you run npm install command

const check = (param, id) => {
    return (param === undefined) ? (id) : ('')
}


if(argv.s !== undefined && argv.q !== undefined && argv.v !== undefined){
    const server = new String(argv.s.split(":")[0]).toString()
    const port = new Number(argv.s.split(":")[1]) 
    const imageName = new String(argv.q)
    const versionNo = new Number(argv.v)

    let packet = ITPpacket.getBytePacket("cock.png", 7)
 
    client.connect(8080, server, () => {
        console.log("CONNECTED TO: " + server + ":" + port);
        client.write(packet)
    });

    client.on("data", (data) => {
        console.log(data)
    })
     
}
else{
    console.log("missing parameters: " + check(argv.s, '-s server') +" "+ check(argv.q, '-q image') +" "+ check(argv.v, '-v version'))
}


// Returns the integer value of the extracted bits fragment for a given packet
function parseBitPacket(packet, offset, length) {
    let number = "";
    for (var i = 0; i < length; i++) {
        // let us get the actual byte position of the offset
        let bytePosition = Math.floor((offset + i) / 8);
        let bitPosition = 7 - ((offset + i) % 8);
        let bit = (packet[bytePosition] >> bitPosition) % 2;
        number = (number << 1) | bit;
    }
    return number;
}

// Prints the entire packet in bits format
function printPacketBit(packet) {
    var bitString = "";

    for (var i = 0; i < packet.length; i++) {
        // To add leading zeros
        var b = "00000000" + packet[i].toString(2);
        // To print 4 bytes per line
        if (i > 0 && i % 4 == 0) bitString += "\n";
        bitString += " " + b.substr(b.length - 8);
    }
    console.log(bitString);
}



