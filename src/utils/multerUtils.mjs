import multer from 'multer';
import path from 'path';
import crypto from 'node:crypto';

console.log(path.dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/');
  },
  filename: function (req, file, cb) {
    try {
      crypto.randomBytes(12, function (error, buffer) {
        console.log(file);
        const uniqueSuffix =
          buffer.toString('hex') + path.extname(file.originalname);

        cb(null, uniqueSuffix);
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

const upload = multer({ storage: storage });
export default upload;
