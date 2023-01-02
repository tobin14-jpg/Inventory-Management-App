const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Creating Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be at least 6 characters"],
        //maxLength: [23, "Password must be at most 23 characters"]
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.stack.imgur.com/l60Hf.png"
    },
    phone: {
        type: String,
        default: "+61"
    },
    bio: {
        type: String,
        default: "bio",
        maxLength: [250, "Bio must be no more than250 characters"]
    },
},
    {
        timestamps: true,
    }
)

// Encrypt password before saving to the db
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

const User = mongoose.model("User", userSchema);
module.exports = User;