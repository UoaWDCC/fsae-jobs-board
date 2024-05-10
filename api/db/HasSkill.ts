import mongoose, { Schema, model, Types } from 'mongoose';

const hasSkillSchema = new Schema({
    memberID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Member ID is required'],
    },
    skillID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Skill ID is required'],
    },
});

const HasSkill = model('hasSkill', hasSkillSchema);

export default HasSkill;
