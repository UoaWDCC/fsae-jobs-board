import mongoose, { Schema, model, Types } from 'mongoose';

const jobAdSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        unique: true,
        maxLength: [100, 'Job title cannot exceed 100 characters'],
        trim: true
    },
    applicationDeadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    applicationLink: {
        type: String,
        required: [true, 'Application link is required'],
    },
    datePosted: {
        type: Date,
        required: [true, 'Date posted is required'],
        default: Date.now
    },
    specialisation: {
        type: String,
        required: [true, 'Specialisation is required'],
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        minLength: [10, 'Description must be at least 10 characters long']
    },
    salary: {
        type: String,
    },
    publisherID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Publisher ID is required'],
    },
});

const JobAd = model('JobAd', jobAdSchema);

export default JobAd;
