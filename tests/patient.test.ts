import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import Patient from "../src/models/patientModel";
import { seedDemoPatients } from "../src/seedDemoPatients";

const patientData = { name: "João Demo", age: 30, gender: "male" };

beforeAll(async () => {
  const uri = process.env.MONGODB_TEST_URI || "mongodb://127.0.0.1:27017";
  await mongoose.connect(uri, {
    dbName: `prontuario_test_${randomUUID().replace(/-/g, "")}`,
    serverSelectionTimeoutMS: 5000,
  });
}, 10000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) await Patient.deleteMany({});
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) await mongoose.connection.dropDatabase();
  } finally {
    await mongoose.disconnect();
  }
});

it("cria, lista, consulta, edita e exclui um paciente", async () => {
  const created = await request(app).post("/api/patients").send(patientData).expect(201);
  expect(created.body).toMatchObject(patientData);

  const path = `/api/patients/${created.body._id}`;
  const list = await request(app).get("/api/patients").expect(200);
  expect(list.body).toEqual([created.body]);
  await request(app).get(path).expect(200, created.body);

  const edited = await request(app).put(path).send({ age: 31 }).expect(200);
  expect(edited.body).toMatchObject({ ...patientData, age: 31 });
  expect((await Patient.findById(created.body._id))?.age).toBe(31);

  await request(app).delete(path).expect(204);
  await request(app).get(path).expect(404);
  await request(app).put(path).send({ age: 32 }).expect(404);
  await request(app).delete(path).expect(404);
});

it("rejeita campos inválidos, documentos incompletos e IDs malformados", async () => {
  await request(app).post("/api/patients").send({ name: "João Demo" }).expect(400);
  await request(app).post("/api/patients").send({ ...patientData, name: "   " }).expect(400);
  await request(app).post("/api/patients").send({ ...patientData, age: 2.5 }).expect(400);
  await request(app).post("/api/patients").type("json").send("{").expect(400);
  await request(app).get("/api/patients/id-invalido").expect(400);

  const patient = await Patient.create(patientData);
  const path = `/api/patients/${patient.id}`;
  await request(app).put(path).send({ age: -1 }).expect(400);
  await request(app).put(path).send({ $unset: { name: 1 } }).expect(400);
  const result = await request(app).get(path).expect(200);
  expect(result.body).toMatchObject(patientData);
});

it("reexecuta a carga fictícia sem duplicar ou sobrescrever cadastros", async () => {
  await seedDemoPatients();
  const patient = await Patient.findOneAndUpdate({ name: "Ana Demo" }, { age: 35 }, { new: true });

  await seedDemoPatients();

  expect(await Patient.countDocuments()).toBe(4);
  expect((await Patient.findById(patient?.id))?.age).toBe(35);
});

it("serve o painel e indica o estado da conexão", async () => {
  await request(app).get("/").expect(200).expect(/Lista de pacientes/);
  await request(app).get("/dashboard.js").expect(200);
  await request(app).get("/api/health").expect(200, { status: "ok" });
  await request(app).get("/api/rota-inexistente").expect(404);
});
