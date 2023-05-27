const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Add a name"]
    },
    email: {
        type: String,
        required: [true, "Add a email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Add a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Add a password"],
        minLength: [6, "Password must be up to 6 characteres"],
        maxLength: [255, "Password must not be more than 255 characteres"]
    },
    photo: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F422281207681860%2F&psig=AOvVaw0DtyA1Vx8fU4KfcJdzRane&ust=1685141030375000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCMDcgdfFkf8CFQAAAAAdAAAAABAE"
    },
    phone: {
        type: String,
        default: "+54"
    },
    bio: {
        type: String,
        maxLength: [255, "Password must not be more than 255 characteres"],
        default: "Not bio added"
    },
}, {
    timestamps: true
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.mongoose.model("User", UserSchema);
module.exports = User;