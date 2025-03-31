import { Router } from 'express';
import { AuthRouter } from '../api/v1/Auth/Auth.routes.mjs';
import { RoleRouter } from '../api/v1/Role/Role.routes.mjs';
const router = Router();

router.use(AuthRouter, RoleRouter);

export { router as TestRouter };
