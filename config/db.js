const mongoose = require('mongoose')

const ConnectDB = async () => {
    try{
        await mongoose.connect(process.env.dbURI)
        console.log('DB connected')
    }
    catch(e){
        console.log(e)
        process.exit(1)
    }
}

module.exports = ConnectDB;