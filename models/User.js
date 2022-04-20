const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   name:
   {
       type: String,
       require: true,
       min: 3,
       max: 30,
       unique: true
   },

   email:
   {
       type: String,
       require: true,
       max: 50
   },

   password:
   {
       type: String,
       min: 4,
       require: true,
       unique: true
   },

   token:
   {
       type: String
   },
},

{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

