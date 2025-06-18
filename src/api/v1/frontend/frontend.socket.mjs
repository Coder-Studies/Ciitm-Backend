import frontendUtils from './frontend.utils.mjs';

let FrontendSocket = async (io, socket) => {
  try {
    let findFrontend = await frontendUtils.findAll();

    if (!findFrontend) {
      throw new Error('Frontend not found');
    }

    socket.on('requestFrontend', async () => {
      try {
        socket.emit('frontend', findFrontend);
      } catch (error) {
        console.error('Error fetching frontend data:', error.message);
      }
    });

    socket.emit('frontend', findFrontend);
  } catch (error) {
    console.error('Error in FrontendSocket:', error.message);
  }
};

export default FrontendSocket;
