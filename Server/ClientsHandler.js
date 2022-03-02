let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {
    handleClientJoining: function (socket, clientNo) {
        //on incoming data
        socket.on("data", (data) => {
            //req packet obj for storing the incoming data
            let reqPacket = {
                clientNo: clientNo,
                "ITP version": data.readInt32BE(0,4),
                "Time Stamp": data.readInt32BE(31,32),
                "Request Type": data.readInt32BE(23,8),
                "Image file name": data.slice(67 + 28).toString('utf16le'),
                "Image Extenstion": data.readInt32BE(63, 4)
            }
            
            //log the data
            console.log(
                "Client-" + clientNo + " requests: " + "\n" +
                "--ITP version: " + reqPacket["ITP version"] + "\n" +
                "--Time Stamp: " + reqPacket["Time Stamp"] + "\n" +
                "-- Request Type: " + reqPacket["Request Type"] + "\n" +
                "-- Image file name: " + reqPacket["Image file name"]
            )

            //using the reqpacket get the new packet to send, use a promise to free up cpu
            ITPpacket.getPacket(reqPacket, singleton).then((packet) => {
                socket.write(packet)//send the packet when finished
            }).catch((err)=> {
                console.log(err)
            })
        })

        //for disconnection
        socket.on("close", () => {
            console.log("Client-" + clientNo + " is closing the connection")
        })

        //for client dropping randomly
        socket.on("error", (ex) => {
            console.log((ex.code === 'ECONNRESET') ? ("Connection droppped") : ("error with socket"))
        })
    }
};