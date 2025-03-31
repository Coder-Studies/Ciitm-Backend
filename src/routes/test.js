import { Router } from "express";
import { AuthRouter } from "../api/v1/Auth/Auth.routes.mjs";
const router = Router();


router.use(
    AuthRouter,
)



export {router as TestRouter}