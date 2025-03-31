import { Router } from 'express';
import RoleController from './Role.controller.mjs';
const routes = Router();

routes.post('/v1/role/create', RoleController.Create_Admin_Role_Controller);

export { routes as RoleRouter };
