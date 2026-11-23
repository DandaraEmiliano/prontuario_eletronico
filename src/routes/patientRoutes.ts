import { Router } from "express";
import * as patientController from "../controllers/patientController";

const router = Router();

router.post("/patients", patientController.createPatient);
router.get("/patients", patientController.getAllPatients);
router.get("/patients/:id", patientController.validatePatientId, patientController.getPatientById);
router.put("/patients/:id", patientController.validatePatientId, patientController.updatePatientById);
router.delete("/patients/:id", patientController.validatePatientId, patientController.deletePatientById);

export default router;
