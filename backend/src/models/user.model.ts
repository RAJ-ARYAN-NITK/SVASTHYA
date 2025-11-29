import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next: any) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password as string);
};

const User = mongoose.model('User', userSchema);

export default User;
