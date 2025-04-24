// Work on V2

// // Retrieve All Contact Form Data from DataBase
// export
// // Delete Single Contact Form on the basic of ID.
// export const delete_FormData = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleteMessage = await contactSchema.findByIdAndDelete(id);

//     if (!deleteMessage) {
//       res.status(404).json({
//         message: 'Message Not Found 😥😥',
//         error: true,
//       });
//     } else {
//       res.json({
//         deleteMessage,
//         message: 'Form Message deleted successfully ❌',
//       });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       message: error.message,
//       error: true,
//     });
//   }
// };

// // View Single Contact Form n the basic of ID.
// export const view_FormData = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log(id);
//     if (!id) {
//       return res.status(404).json({
//         message: 'Please Provide Message Id',
//         error: true,
//       });
//     }

//     const formData = await contactSchema.findById(id);

//     if (!formData) {
//       let error = Error();
//       error.message = 'Invalid Message Id';
//       error.status = 404;
//       throw error;
//     }

//     res.json(formData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: error.message,
//       error: true,
//     });
//   }
// };
