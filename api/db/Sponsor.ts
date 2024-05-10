import mongoose, { Schema, model } from 'mongoose';

const sponsorSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        unique: true,
        index: true
    },
    logo: {
        type: String,
        required: [true, 'Logo is required'],
    },
    websiteURL: {
        type: String,
        required: [true, 'Website URL is required'],
    },
    tier: {
        type: String,
        required: [true, 'Tier is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [100, 'Name cannot be more than 100 characters'],
        minLength: [2, 'Name must be at least 2 characters long']
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        maxLength: [50, 'Industry name cannot be more than 50 characters'],
        minLength: [3, 'Industry name must be at least 3 characters long']
    },
});

const Sponsor = model('Sponsor', sponsorSchema);

export default Sponsor;
