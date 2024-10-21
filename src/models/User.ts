import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    id: string;
    googleId?: string;
    facebookId?: string;
    appleId?: string;
    instagramId?: string;
    phoneNumber?: string;
    name: string;
    email?: string;
    age?: number;
    gender?: string;
    authProvider: 'otp' | 'google' | 'facebook';
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    googleId: { type: String },
    facebookId: { type: String },
    appleId: { type: String },
    instagramId: { type: String },
    phoneNumber: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true },
    age: { type: Number },
    gender: { type: String },
    authProvider: { type: String, enum: ['otp', 'google', 'facebook'], required: true },
});

// Conditional validation
UserSchema.pre<IUser>('validate', function (next) {
    if (this.authProvider === 'otp') {
        if (!this.phoneNumber) {
            this.invalidate('phoneNumber', 'Phone number is required for local authentication.');
        }
        // No password field for passwordless auth
    }
    next();
});



const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;


