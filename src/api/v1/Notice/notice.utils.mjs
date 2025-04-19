import Notice from './notice.model.mjs';

class Notice_Utils {
  FindByName = async (name) => {
    return await Notice.findOne({ title: name });
  };
}

export default new Notice_Utils();
