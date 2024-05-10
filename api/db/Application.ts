import mongoose, { Schema, model, Types } from 'mongoose';

const applicationSchema = new Schema({
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Member ID is required'],
    },
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job ID is required'],
    },
    status: {
        type: String,
        required: [true, 'Application status is required'],
        enum: ['submitted', 'reviewed', 'accepted', 'rejected'],
        default: 'submitted'
    },
    applicationDate: {
        type: Date,
        required: [true, 'Application date is required'],
        default: Date.now
    },
});

const Application = model('application', applicationSchema);

export default Application;
