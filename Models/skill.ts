import mongoose from "mongoose";
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: { type: String, required: true ,unique:true},
  description: { type: String },
},
{
    timestamps:true
}
);

export default mongoose.model('Skill', skillSchema);