const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    user: 
    {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    name:
    {
        type: String,
        require: true,
        unique: true,
    }
},

{ timestamps: true }

);

module.exports = mongoose.model("Bootcamp", BootcampSchema);