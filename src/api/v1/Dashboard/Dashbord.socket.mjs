import ContactUtils from '../Contact/Contact.utils.mjs';

let find_DashBoard_Data = async(socket) => {
 
  let NUMBER_OF_CONTACT = await ContactUtils.FIND_NUMBER_OF_CONTACT();

  console.log('NUMBER_OF_CONTACT', NUMBER_OF_CONTACT);

  let DashBoard_Data = [
    {
      name: 'Total Contact',
      value: NUMBER_OF_CONTACT,
      icon: 'https://icon-library.com/images/contact-app-icon/contact-app-icon-12.jpg',
      color: '#FF5733',
    },
  ];

  console.log('DashBoard_Data', DashBoard_Data);

  socket.emit('DashBoard_Data', {
    status: true,
    message: 'Data Found',
    DashBoard_Data,
  });
};

let DashBoard_Socket = (socket) => {

  
socket.on('Request_DashBoard_Data' , async () => {
    console.log('Request_DashBoard_Data event triggered');
    await find_DashBoard_Data(socket); 
  }
);


  socket.on('DashBoard_Confirmation', async ({ContactConfirmation}) => {
      if (ContactConfirmation) {
        console.log('Triggering find_DashBoard_Data due to contact confirmation...');
        await find_DashBoard_Data(socket); 
      }
  });
};

export default DashBoard_Socket;
