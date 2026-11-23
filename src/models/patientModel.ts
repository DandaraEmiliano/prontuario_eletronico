import mongoose, { Schema } from "mongoose";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const careStatuses = ["admitted", "observation", "discharged"] as const;

interface PatientData {
  name: string;
  age: number;
  gender: string;
  recordNumber?: string;
  birthDate?: string;
  bloodType?: typeof bloodTypes[number] | "";
  allergies?: string;
  unit?: string;
  bed?: string;
  admittedOn?: string;
  careStatus?: typeof careStatuses[number] | "";
  careTeam?: string;
}

function isCalendarDate(value: string): boolean {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const date = new Date(value);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

const patientSchema = new Schema<PatientData>({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  age: { type: Number, required: true, min: 0, max: 130, validate: Number.isInteger },
  gender: { type: String, required: true, trim: true, maxlength: 60 },
  recordNumber: { type: String, trim: true, maxlength: 40 },
  birthDate: { type: String, trim: true, validate: isCalendarDate },
  bloodType: { type: String, trim: true, enum: ["", ...bloodTypes] },
  allergies: { type: String, trim: true, maxlength: 500 },
  unit: { type: String, trim: true, maxlength: 80 },
  bed: { type: String, trim: true, maxlength: 40 },
  admittedOn: { type: String, trim: true, validate: isCalendarDate },
  careStatus: { type: String, trim: true, enum: ["", ...careStatuses] },
  careTeam: { type: String, trim: true, maxlength: 120 },
}, { bufferCommands: false });

export default mongoose.model("Patient", patientSchema);
