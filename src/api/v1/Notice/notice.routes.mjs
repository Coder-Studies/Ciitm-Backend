import { Router } from "express";
import noticeController from "./notice.controller.mjs";
const router = Router();


router.post('/v1/notice/create', noticeController.Create)

export {  router as NoticeRouter}