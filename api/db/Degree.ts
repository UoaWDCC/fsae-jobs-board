import mongoose, { Schema, model, Types } from 'mongoose';

const degreeSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
    },
    degreeLevel: {
        type: String,
        required: [true, 'Degree level is required'],
        enum: ['Bachelor', 'Master', 'PhD', 'Associate'],
    },
    faculty: {
        type: String,
        required: [true, 'Faculty is required']
    },
    specialisation: {
        type: String,
        required: [true, 'Specialisation is required']
    },
    isConjoint: {
        type: Boolean,
        required: [true, 'Conjoint status is required'],
        default: false
    },
    graduationYear: {
        type: Number,
        required: [true, 'Graduation year is required'],
    },
    currentYear: {
        type: Number,
        required: [true, 'Current year in program is required'],
    },
});

const Degree = model('degree', degreeSchema);

export default Degree;
