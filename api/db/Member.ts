import mongoose, { Schema, model, Types } from 'mongoose';

const memberSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        unique: true,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        maxLength: [40, 'First name cannot exceed 40 characters'],
        minLength: [1, 'First name must be at least 1 character long'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        maxLength: [40, 'Last name cannot exceed 40 characters'],
        minLength: [1, 'Last name must be at least 1 character long'],
        trim: true
    },
    cv: {
        type: String,
        required: [true, 'CV is required'],
    },
    jobSearchStatus: {
        type: String,
        required: [true, 'Job search status is required'],
        enum: {
            values: ['active', 'inactive', 'searching', 'employed'],
            message: '{VALUE} is not a valid job search status'
        }
    },
    subGroup: {
        type: String,
        required: [true, 'Subgroup is required'],
    },
    photo: {
        type: String,
        required: [true, 'Photo URL is required'],
    },
});

const member = model('memberSchema', memberSchema);

export default member;
