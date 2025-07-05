import { Router } from "express";
import FeeController from "./fee.controller.mjs";
const router = Router();


router.get("/v1/Student/FeeInfo", FeeController.Get_Fee_Info )




export {router as Fee_Routes};