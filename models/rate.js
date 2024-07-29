const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
    rate:Number,
    comment:String,
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Rate = mongoose.model("Rate",rateSchema);

module.exports = Rate;