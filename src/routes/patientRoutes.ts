import { Router } from "express";
import * as patientController from "../controllers/patientController";

const router = Router();

router.post("/patients", patientController.createPatient);
router.get("/patients", patientController.getAllPatients);
router.get("/patients/:id", patientController.getPatientById);
router.put("/patients/:id", patientController.updatePatientById);
router.delete("/patients/:id", patientController.deletePatientById);

export default router;
