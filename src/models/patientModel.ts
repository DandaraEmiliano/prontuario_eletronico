import mongoose, { Schema } from "mongoose";

interface PatientData {
  name: string;
  age: number;
  gender: string;
}

const patientSchema = new Schema<PatientData>({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  age: { type: Number, required: true, min: 0, max: 130, validate: Number.isInteger },
  gender: { type: String, required: true, trim: true, maxlength: 60 },
}, { bufferCommands: false });

export default mongoose.model("Patient", patientSchema);
