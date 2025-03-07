import Admission from '../models/Admission.model.js';
import AdmissionSchema from '../models/Admission.model.js';
import Authentication from '../models/AuthenticationSchema.model.js';
import status from '../models/Status.model.js';
import Student_Course from '../models/student-course.model.js';
import { sendMail } from './admin.service.js';

import { find_Course, find_Course_by_studentId } from './client.service.js';

export let create_Student = async ({ data, uniqueId, course, image_Url }) => {
  try {
    const admission = await AdmissionSchema.create({
      uniqueId: uniqueId,

      student: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality,
        contactNumber: Number(data.contactNumber),
        avtar: image_Url,
      },

      guardian: {
        Gname: data.Gname,
        Grelation: data.Grelation,
        GcontactNumber: Number(data.GcontactNumber),
      },

      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      },

      AadharCard: {
        AadharCardNumber: data.AadharCardNumber,
      },

      tenth: {
        tenthMarks: data.tenthMarks,
        tenthBoard: data.tenthBoard,
        tenthGrade: data.tenthGrade,
      },

      twelfth: {
        twelfthMarks: data.twelfthMarks,

        twelfthBoard: data.twelfthBoard,

        twelfthGrade: data.twelfthGrade,
      },

      fee: {
        amount_due: course.course_Fee,
        course_Fee: course.course_Fee,
      },

      fee: {
        amount_paid: 0,
        late_Fine: 0,
        amount_due: 0,
        course_Fee: 0,
      },

      course_Id: course._id,
      mode: data.mode,
      university: data.university,
    });

    if (!admission) {
      throw Error('Fail to take Admission');
    }

    return admission;
  } catch (error) {
    console.error('Error:', error);
    Error('Error:', error.message);
  }
};

export let Sign_Up_Student = async ({
  name,
  email,
  password,
  orignal_password,
}) => {
  console.log('name:', name);
  console.log('email:', email);
  console.log('password:', password);
  console.log('orignal_password:', orignal_password);

  let Create_Student = await Authentication.create({
    provider_Name: 'local_Login',
    name: name,
    email: email,
    email_verified: true,
    password: password,
    providerId: email,
  });

  if (!Create_Student) {
    throw new Error('Failed to create new student record');
  }

  let Send_Sign_UP_Mail = await sendMail({
    recipientEmail: email,
    name: name,
    subject: 'Welcome to the University',
    html: `
    <div style="font-family: Arial, sans-serif; color: white; background-color: #2c3e50; padding: 20px; text-align: center;">
  <h1 style="color: #ecf0f1;">Welcome to the University, ${name} ! 🎓</h1>
  <p style="font-size: 18px; color: #ecf0f1;">We are excited to inform you that your application has been approved! 🥳</p>
  <p style="font-size: 16px; color: #ecf0f1;">You can now log in to your account and start your journey with us! 🌟</p>
  <br/>
  <p style="font-size: 16px; color: #ecf0f1;">To log in, use your credentials below:</p>
  <br/>
  <p style="font-size: 16px; color: #ecf0f1;">Email: ${email}</p>
  <p style="font-size: 16px; color: #ecf0f1;">Password: ${orignal_password}</p>
  <br/>
  <p style="font-size: 18px; color: #ecf0f1;">We look forward to having you join our academic community! 🌍✨</p>
  <br/>
  <p style="font-size: 16px; color: #ecf0f1;">If you have any questions, feel free to reach out to us. 📧</p>
</div>
    
    `,
  });

  AdmissionSchema.updateOne(
    { email: email },
    {
      $set: { admited: true }
    }
  )
  .then((result) => {
    console.log('Update Result:', result);
  })
  .catch((err) => {
    console.error('Error updating document:', err);
  });
  

  console.log('Send_Sign_UP_Mail: 2', Send_Sign_UP_Mail);

  return Create_Student;
};

export let get_Payment_info = async ({ uniqueId }) => {
  try {


    let Find_Student = await Admission.findOne({
      uniqueId: uniqueId,
    })

    if (!Find_Student) {
      throw new Error('Student not found');
    };
    

    let isApproved = await Admission.findOne({
      uniqueId: uniqueId,
    }).select('admited'); 



    if (!isApproved) {
      throw new Error('You are not approved to pay the fee');
    }

    let find_Student = await Admission.findOne({
      uniqueId: uniqueId,
    });

    if (!find_Student) {
      throw new Error('Student not found');
    }

 
    
    let Course = await find_Course_by_studentId({id: find_Student._id.toString()});

    let data = {
      Student_id: find_Student.uniqueId,
      student: find_Student.student,
      course: Course,
      fee: find_Student.fee,
    }


    
    return data;


  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.message || 'Failed to get Payment info');
  }
};
