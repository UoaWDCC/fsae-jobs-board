import mongoose, { Schema, model, Types } from 'mongoose';

const requireSchema = new Schema({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        maxLength: 40,
        minLength: 1,
    },
    skillID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        maxLength: 40,
        minLength: 1,
    },
});

const Require = model('Require', requireSchema);

export default Require;
