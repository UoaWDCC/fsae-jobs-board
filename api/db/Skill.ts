import mongoose, { Schema, model, Types } from 'mongoose';

const skillSchema = new Schema({
    skillName: {
        type: String,
        required: [true, 'Skill name is required'],
        trim: true,
        unique: true,
        maxLength: [50, 'Skill name must not exceed 50 characters']
    },
});

const Skill = model('Skill', skillSchema);

export default Skill;

