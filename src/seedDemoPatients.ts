import { Types } from "mongoose";
import Patient from "./models/patientModel";

const demoPatients = [
  { _id: "660000000000000000000001", name: "Ana Demo", age: 34, gender: "female" },
  { _id: "660000000000000000000002", name: "Caio Demo", age: 46, gender: "male" },
  { _id: "660000000000000000000003", name: "Alex Demo", age: 27, gender: "non-binary" },
  { _id: "660000000000000000000004", name: "Marina Demo", age: 62, gender: "female" },
];

export async function seedDemoPatients() {
  await Patient.bulkWrite(demoPatients.map(({ _id, ...patient }) => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(_id) },
      update: { $setOnInsert: { ...patient, __v: 0 } },
      upsert: true,
    },
  })));
}
