let fs = require("fs")

// You may need to add some delectation here

module.exports = {
    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: async function (data, singleton) {
        let path = "images/" + data["Image file name"] + "." + imgType(data["Image Extenstion"])//build the path string from the data

        let doesExist = fs.existsSync(path)//check if the path is right

        let imgData = {
            responseType: (doesExist) ? (1) : (2), //return a value based on the correct input or not
            bytes: (doesExist) ? (await getImageEnc(path)) : (0) //using async get the image buffer
        }

        let resPacket = Buffer.alloc(96) //alloc a buffer for the packet data

        resPacket.writeInt32BE(7, 0, 4)
        resPacket.writeInt32BE(imgData.responseType, 4, 8)
        resPacket.writeInt32BE(singleton.getSequenceNumber(), 12, 20)
        resPacket.writeInt32BE(singleton.getTimestamp(), 32, 32)
        resPacket.writeInt32BE(imgData.bytes.length, 64, 32)


        return Buffer.concat([resPacket, imgData.bytes]);//return both buffers attatched to eachother
    }
};

//or getting the image buffer
const getImageEnc = async (fileName) => {
    let data = await fs.promises.readFile(fileName) //wait for the file to open 

    return Buffer.from(data); //return a buffer of the data
}

//for getting the image extension
const imgType = (val) => {
    switch (val) {
        case (1):
            return 'bmp'
        case (2):
            return 'jpeg'

        case (3):
            return "gif"

        case (4):
            return 'png'

        case (5):
            return 'tiff'

        default:
            return 'none'
    }
}