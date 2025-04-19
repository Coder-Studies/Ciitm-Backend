import { uploadOnCloudinary } from "../../../utils/Cloudinary.mjs";
import SendResponse from "../../../utils/SendResponse.mjs";
import Notice_Constants from "./notice.constant.mjs";
import noticeService from "./notice.service.mjs";

class Notice_Controller {
  Create = async (req, res) => {
    try {
      let { title, content, type } = req.body;
      const { filename } = req.file;

      let doc = await uploadOnCloudinary(filename);

      let Created_Notice = await noticeService.create_Notice({
        title,
        content,
        type,
        doc_link: doc.url,
      });

     

      SendResponse.success(
        res,
        200,
        Notice_Constants.CREATED,
        Created_Notice
      );
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Error Creating Notice',
        status: 'Failed',
      });
    }
  };
}

export default new Notice_Controller();
