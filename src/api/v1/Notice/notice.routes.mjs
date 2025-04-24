import { Router } from 'express';
import noticeController from './notice.controller.mjs';
import upload from '../../../utils/multerUtils.mjs';
const router = Router();

router.post('/v1/notice/create', upload.single('doc'), noticeController.Create);
router.get('/v1/notice/find', noticeController.Find);

export { router as NoticeRouter };
