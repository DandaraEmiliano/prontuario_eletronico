import { Request, Response } from "express";
import Patient from "../models/patientModel";

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.status(200).json(patient);
  } catch (err) {
    res.status(404).send("Patient not found");
  }
};

export const updatePatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(patient);
  } catch (err) {
    res.status(404).send("Patient not found");
  }
};

export const deletePatientById = async (req: Request, res: Response) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).send("Patient not found");
  }
};
