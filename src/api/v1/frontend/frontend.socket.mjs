import frontendUtils from './frontend.utils.mjs';

let FrontendSocket = async (socket) => {
  try {
    let findFrontend = await frontendUtils.findAll();
    console.log('findFrontend:', findFrontend);

    if (!findFrontend) {
      throw new Error('Frontend not found');
    }

    socket.emit('frontend', findFrontend);
  } catch (error) {
    console.error('Error in FrontendSocket:', error.message);
    socket.emit('error', {
      error: error.message,
    });
  }
};

export default FrontendSocket;
