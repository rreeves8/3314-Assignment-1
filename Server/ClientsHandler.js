let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {
    handleClientJoining: function (socket, clientNo) {
        socket.on("data", (data)=>{
            var enc = new TextDecoder("utf-8");
            
            console.log(
                "Client-" + clientNo + " requests: " + "\n" +
                "--ITP version: " + parseBitPacket(data, 0, 4) + "\n" +
                "--Time Stamp: " + singleton.getTimestamp() + "\n" +
                "-- Request Type: " + parseBitPacket(data, 24, 8) + "\n" +
                "-- Image file name: " + enc.decode(parseBitPacket(data, 64, parseBitPacket(data, 32, 28)))
            )
            let packet = ITPpacket.getPacket(data)
            socket.write(packet)
        })

        socket.on("close", ()=>{
            console.log("Client-" + clientNo + " is closing the connection")
        })

        socket.on("error", (ex) => {
            console.log((ex.code === 'ECONNRESET') ? ("Connection droppped") : ("error with socket"))
        })
    }
};


//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

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

// Converts byte array to string
function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}