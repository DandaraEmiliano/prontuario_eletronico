import request from "supertest";
import app from "../src/server";
import Patient from "../src/models/patientModel";

describe("Patient Controller", () => {
  it("should create a new patient", async () => {
    const patientData = {
      name: "João Gabriel",
      age: 30,
      gender: "male",
    };

    const response = await request(app).post("/api/patients").send(patientData);

    expect(response.status).toBe(201);

    const createdPatient = await Patient.findOne({ name: "João Gabriel" });
    expect(createdPatient).toBeTruthy();
    expect(createdPatient?.name).toBe("João Gabriel");
    expect(createdPatient?.age).toBe(30);
    expect(createdPatient?.gender).toBe("male");
  });
});
