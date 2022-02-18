// Some code need to be added here, that are common for the module
let timeStamp = 0
let sequenceNumber

module.exports = {
    init: function() {
       // init function needs to be implemented here //
        setInterval(()=> {
            if(timeStamp + 1 > 4294967296){
                timeStamp = 0
            }
            else{
                timeStamp++
            }
        }, 10)

        sequenceNumber = Math.floor(Math.random() * 999)
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
      // Enter your code here //
        return sequenceNumber++
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timeStamp
    }


};