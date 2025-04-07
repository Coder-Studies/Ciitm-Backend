import { Router } from 'express';
import RoleController from './Role.controller.mjs';
import AuthMiddleware from '../../../middleware/Auth.middleware.mjs';

const routes = Router();

routes.post(
  '/v1/role/create',
  AuthMiddleware.Admin,
  RoleController.Create_Admin_Role_Controller
);

export { routes as RoleRouter };
