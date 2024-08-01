const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        // required: true,
        default: 'user'
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
