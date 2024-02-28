import request from "supertest";
import app from "../../src/server";
import Patient from "../../src/models/patientModel";

describe("Patient API Endpoints", () => {
  it("should fetch all patients", async () => {
    const patients = [
      { name: "Gabriel Silva", age: 30, gender: "male" },
      { name: "Barbara Santos", age: 25, gender: "female" },
    ];

    Patient.find = jest.fn().mockResolvedValue(patients);

    const res = await request(app).get("/api/patients");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(patients);
  });
});
