import ContactUtils from '../Contact/Contact.utils.mjs';

// This function will handle the logic of fetching the dashboard data
let find_DashBoard_Data = async (io) => {
  try {
    // Fetch the number of contacts
    let NUMBER_OF_CONTACT = await ContactUtils.FIND_NUMBER_OF_CONTACT();
    console.log('NUMBER_OF_CONTACT', NUMBER_OF_CONTACT);

    // Prepare the dashboard data
    let DashBoard_Data = [
      {
        name: 'Total Contact',
        value: NUMBER_OF_CONTACT,
        icon: 'https://icon-library.com/images/contact-app-icon/contact-app-icon-12.jpg',
        color: '#FF5733',
      },
    ];

    // Emit the data back to the client that requested it
    io.emit('DashBoard_Data', {
      status: true,
      message: 'Data Found',
      DashBoard_Data,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    io.emit('DashBoard_Data', {
      status: false,
      message: 'Error fetching data',
      DashBoard_Data: [],
    });
  }
};

// Socket event handler
let DashBoard_Socket = (io, socket) => {
  // Listen for the 'Request_DashBoard_Data' event from the client
  socket.on('Request_DashBoard_Data', async () => {
    console.log('Request_DashBoard_Data event triggered');
    await find_DashBoard_Data(io); // Call the function to fetch data and send it back to the client
  });
};

export default DashBoard_Socket;
