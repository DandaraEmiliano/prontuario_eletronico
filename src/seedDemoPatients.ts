import { Types } from "mongoose";
import Patient from "./models/patientModel";

const demoPatients = [
  {
    _id: "660000000000000000000001", name: "Ana Demo", age: 34, gender: "female",
    recordNumber: "PR-1001", birthDate: "1992-05-18", bloodType: "A+",
    allergies: "Penicilina", unit: "Clínica Médica", bed: "12-A", admittedOn: "2026-11-20",
    careStatus: "admitted", careTeam: "Equipe de Clínica Médica",
  },
  {
    _id: "660000000000000000000002", name: "Caio Demo", age: 46, gender: "male",
    recordNumber: "PR-1002", birthDate: "1980-04-06", bloodType: "O+",
    unit: "Pronto Atendimento", bed: "OBS-03", admittedOn: "2026-11-23",
    careStatus: "observation", careTeam: "Equipe de Pronto Atendimento",
  },
  {
    _id: "660000000000000000000003", name: "Alex Demo", age: 27, gender: "non-binary",
    recordNumber: "PR-1003", birthDate: "1999-08-21", bloodType: "AB+",
    unit: "Cirurgia", bed: "21-B", admittedOn: "2026-11-19",
    careStatus: "admitted", careTeam: "Equipe de Cirurgia",
  },
  {
    _id: "660000000000000000000004", name: "Marina Demo", age: 62, gender: "female",
    recordNumber: "PR-1004", birthDate: "1964-03-12", bloodType: "B-",
    unit: "Clínica Médica", admittedOn: "2026-11-16", careStatus: "discharged",
    careTeam: "Equipe de Clínica Médica",
  },
] as const;

export async function seedDemoPatients() {
  await Patient.bulkWrite(demoPatients.map(({ _id, ...patient }) => ({
    updateOne: {
      filter: { _id: new Types.ObjectId(_id) },
      update: { $setOnInsert: { ...patient, __v: 0 } },
      upsert: true,
    },
  })));
}
