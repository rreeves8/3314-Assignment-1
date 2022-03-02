module.exports = {
    //--------------------------
    //getBytePacket: returns the entire packet in bytes
    //--------------------------
    getBytePacket: function (imgData, versionNo, timeStamp) {
        let imgName = imgData.split(".")[0] //get image name
        let imgExt = imgData.split(".")[1] //get image extenstion

        var imgBuffer = Buffer.from(imgName, 'utf16le') //get the byte buffer from the image name string

        let reqPacket = Buffer.alloc(67 + 28) //allocate the right amount of bytes for the data buffer

        reqPacket.writeIntBE(versionNo, 0, 4) //version number
        reqPacket.writeInt32BE(0, 23, 8) //request type, query
        reqPacket.writeInt32BE(timeStamp, 31, 32)
        reqPacket.writeInt32BE(imgType(imgExt), 63, 4)
        reqPacket.writeInt32BE(imgBuffer.length, 67, 28)
        
        return Buffer.concat([reqPacket,imgBuffer]) //combine the image name buffer and the data buffer
    },
};

//switch for getting image type
const imgType = (val) => {
    switch(val){
        case('bmp'):
            return 1

        case('jpeg'):
            return 2
    
        case('gif'):
            return 3

        case('png'):
            return 4

        case('tiff'):
            return 5

        default:
            return 15
    }
}