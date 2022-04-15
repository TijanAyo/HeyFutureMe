const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},  {timestamps: true}
)

module.exports = mongoose.model('mail', mailSchema)