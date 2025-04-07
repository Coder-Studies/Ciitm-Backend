import Frontend from './frontend.model.mjs';

class Frontend_utils {
  findAll = async () => {
    return await Frontend.findOne();
  };
}

export default new Frontend_utils();
