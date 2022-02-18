// You may need to add some delectation here

module.exports = {
    init: function () {
        // feel free to add function parameters as needed
        //
        // enter your code here
        //
    },

    //--------------------------
    //getBytePacket: returns the entire packet in bytes
    //--------------------------
    getBytePacket: function (imgData, versionNo) {
        let imgName = imgData.split(".")[0]
        let imgExt = imgData.split(".")[1]

        let reqPacket = new BufferArray()

        var enc = new TextEncoder()
        let encoded = enc.encode(imgName)

        storeBitPacket(reqPacket, versionNo, 0, 4) //version number
        storeBitPacket(reqPacket, 0, 24, 8) //request type, query
        storeBitPacket(reqPacket, imgType(imgExt), 32, 4)
        storeBitPacket(reqPacket, encoded.byteLength, 36, 28)
        storeBitPacket(reqPacket, encoded, 36 + 28, encoded.byteOffset)

        return reqPacket
    },
};

//// Some usefull methods ////
// Feel free to use them, but DON NOT change or add any code in these methods.

const imgType = (val) => {
    return (
        (val === 'bmp') ? (1) : (
            (val === 'jpeg') ? (2) : (
                (val === 'gif') ? (3) : (
                    (val === 'png') ? (4) : (
                        (val === 'tiff') ? (5) : (15)
                    )
                )
            )
        )
    )
}

// Convert a given string to byte array
function stringToBytes(str) {
    var ch,
        st,
        re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i); // get char
        st = []; // set up "stack"
        do {
            st.push(ch & 0xff); // push byte to stack
            ch = ch >> 8; // shift value down by 1 byte
        } while (ch);
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse());
    }
    // return an array of bytes
    return re;
}

// Store integer value into specific bit poistion the packet
function storeBitPacket(packet, value, offset, length) {
    // let us get the actual byte position of the offset
    let lastBitPosition = offset + length - 1;
    let number = value.toString(2);
    let j = number.length - 1;
    for (var i = 0; i < number.length; i++) {
        let bytePosition = Math.floor(lastBitPosition / 8);
        let bitPosition = 7 - (lastBitPosition % 8);
        if (number.charAt(j--) == "0") {
            packet[bytePosition] &= ~(1 << bitPosition);
        } else {
            packet[bytePosition] |= 1 << bitPosition;
        }
        lastBitPosition--;
    }
}
