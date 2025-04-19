import Notice from './notice.model.mjs';

class Notice_Utils {
  FindByName = async (name) => {
    return await Notice.findOne({ title: name });
  };

  FIND = async (limit, page) => {
    return await Notice.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ dateIssued: -1 });
  };
}

export default new Notice_Utils();
