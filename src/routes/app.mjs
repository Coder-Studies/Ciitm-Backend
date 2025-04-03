import { Router } from "express";

const app = Router();
import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { RoleRouter } from '../api/v1/Role/Role.routes.mjs';
import { StatusRouter } from "../api/v1/Status/Status.routes.mjs";
import { AdmissionRouter } from "../api/v1/Admission/Admission.routes.mjs";



app.use('/api', AuthRouter, RoleRouter , StatusRouter , AdmissionRouter);


export default app;