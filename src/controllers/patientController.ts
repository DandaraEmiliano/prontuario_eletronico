import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import Patient from "../models/patientModel";

function patientFields(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  const { name, age, gender } = body as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries({ name, age, gender }).filter(([, value]) => value !== undefined),
  );
}

export function validatePatientId(req: Request, res: Response, next: NextFunction) {
  if (!isObjectIdOrHexString(req.params.id)) {
    res.status(400).json({ error: "Identificador de paciente inválido." });
    return;
  }
  next();
}

function patientNotFound(res: Response) {
  res.status(404).json({ error: "Paciente não encontrado." });
}

export async function createPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await Patient.create(patientFields(req.body));
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
}

export async function getAllPatients(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await Patient.find().sort({ name: 1, _id: 1 }));
  } catch (error) {
    next(error);
  }
}

export async function getPatientById(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      patientNotFound(res);
      return;
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function updatePatientById(req: Request, res: Response, next: NextFunction) {
  try {
    const fields = patientFields(req.body);
    if (Object.keys(fields).length === 0) {
      res.status(400).json({ error: "Informe pelo menos um campo para atualizar." });
      return;
    }
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true, runValidators: true },
    );
    if (!patient) {
      patientNotFound(res);
      return;
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
}

export async function deletePatientById(req: Request, res: Response, next: NextFunction) {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      patientNotFound(res);
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
