import dotenv from 'dotenv';
dotenv.config();
import { createTransport } from '../utils/SendMail.js';

/**
 * Importing models
 **/

import Frontend from '../models/Frontend.model.js';
import socialMedia from '../models/Social_Media.model.js';
import Social_Link_Validator from '../validation/Social_Link.Joi.js';
import Admin_Role from '../models/Admin_Role.model.js';
import Notice from '../models/Notice.model.js';
import TeacherSchema from '../models/Teacher.model.js';
import status from '../models/Status.model.js';
import Admission from '../models/Admission.model.js';

export const create_Admin = async () => {
  try {
  } catch (error) {
    return error;
  }
};

export const Create_Social_Link = async ({
  linkedin,
  facebook,
  instagram,
  email,
  Number,
}) => {
  let link_Validator = await Social_Link_Validator.validateAsync({
    linkedin,
    facebook,
    instagram,
    email,
    Number,
  });
};

export const Created_Frontend = async () => {
  try {
    let Created_Frontend = await Frontend.create({
      logo: 'Ciitm Dhanbad',
      landingPage: {
        HeroSection: {
          homeBackgroundImage: '/api/images/Home_bg.webp',
          homeTitle: 'Shape Tomorrow with Quality Education',
          homeParagraph:
            'Empowering students to achieve academic success with professional resources',
        },
        AboutSection: {
          Heading_First: 'Empowering Young Minds, Shaping Bright Futures',
          Heading_Second: 'Empowering Young Minds, Shaping Bright Futures',

          paragraph_First:
            '[Your School Name] has been a cornerstone of quality education for [X] years. We believe in nurturing young minds with innovative teaching methods, a caring environment, and opportunities for holistic growth. Our mission is to inspire students to achieve academic success, develop strong character, and contribute positively to society.',

          paragraph_Second:
            'a caring environment, and opportunities for holistic growth. Our mission is to inspire students to achieve academic success, develop strong character, and contribute positively to society.',

          image_First: '/api/images/Rectangle_1.webp',

          image_Second: '/api/images/Rectangle-2.webp',

          image_Third: '/api/images/Rectangle.webp',
        },

        Mission_and_Goals: [
          {
            title: 'Innovation',
            content: 'Delivering top-notch education for success.',
            image: '/api/images/Bagpack.webp',
          },
          {
            title: 'Integrity',
            content: 'Building a Foundation of Trust and Ethics',
            image: '/api/images/Knowledge.webp',
          },
          {
            title: 'Excellence',
            content: 'Setting the Benchmark for Quality Education',
            image: '/api/images/Student.webp',
          },
          {
            title: 'Diversity',
            content: 'Celebrating Cultures, Ideas, and Perspectives',
            image: '/api/images/Clock.webp',
          },
          {
            title: 'Collaboration',
            content: 'Celebrating Cultures, Ideas, and Perspectives',
            image: '/api/images/Webinar.webp',
          },
          {
            title: 'Sustainability',
            content: 'Shaping a Greener Tomorrow',
            image: '/api/images/Research.webp',
          },
        ],
      },

      aboutPage: {
        AboutHero: {
          image: '/api/images/About_Hero.webp',
          Heading: 'Let’s learn about new Knowledge and abitlites',
          paragraph:
            'Welcome to [Institute Name], an institution dedicated to fostering innovation, knowledge, and personal growth. Our mission is to shape tomorrow’s leaders by offering exceptional educational opportunities and encouraging intellectual exploration.',
        },

        History: {
          title: 'History',

          paragraph_First:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities. Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities.',

          paragraph_Second:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning,',

          paragraph_Third:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities. Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities.',

          paragraph_Four:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning,',
        },

        Vision_and_Mission: {
          title: 'Vision & Mission',

          paragraph_First:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities. Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities.',

          paragraph_Second:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning,',

          paragraph_Third:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities. Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning, committed to nurturing talent and empowering communities.',

          paragraph_Four:
            'Founded in [Year], [Institute Name] was established to address the growing demand for quality education and skill development. Over the years, it has become a beacon of innovation and learning,',
        },

        Description: {
          image:
            'https://www.shutterstock.com/image-vector/maintenance-facility-management-concept-house-260nw-1104393374.jpg',

          paragraph:
            'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others. The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

          price: 5000,

          room: '1 Room square shape',
        },

        Facilities: [
          {
            title: 'Hostels',
            Heading:
              'There are twenty eight Hostels including eleven separate Hostels for female students. The residential accommodation in each of these Hostels comprises of cubicles and three-seat dormitories.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEuJOyNXxDlfbwcGQCXTdH2LLMSRUKClRcPQ&s',
            Number: '180 Rooms',
            Price: 5000,
          },

          {
            title: 'transport',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            image:
              'https://wp.trackschoolbus.com/wp-content/uploads/2023/11/schoolbus.jpg',
            Number: '2000 Bus',
            Price: 800,
          },

          {
            title: 'digital class',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQyqO6TNUjWhgZauRa2dg6gVWI2Fukq3_N9w&s',
            Number: '150 Digital Class',
          },

          {
            title: 'Video Conference',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb55INaZH7dEyUHMYyPzjkHUesLEQ9ji4SHQ&s',
          },
          {
            title: 'Health',
            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNI3LS1z14tvidra1A5KWaI6SxmhRSO9D1TRBlNijCCC30tcBinKM_twf77IkYOzVexVU&usqp=CAU',
          },
          {
            title: 'Sports',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',
            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhWn063fQ4fmkvvy4h9vm54glX01EBIrMc5Q&s',
            Number: '2 Filed',
            Price: 800,
          },
          {
            title: 'Library',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image:
              'https://cdn.firstcry.com/education/2022/03/07110617/700225975-696x476.jpg',
            Number: '1 Library',
            Price: 900,
          },
          {
            title: 'Curricular Activities',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image: '/api/images/Curricular_Activities.webp',
          },
          {
            title: 'News & Events',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image: '/api/images/News_Events.webp',
          },
          {
            title: 'Internet Infrastructure',

            Heading:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            description:
              'The University of the institute provides several facilities to staff and students, which include health, hostel, transport, library, sports and various others.',

            image: '/api/images/Internet_Infrastructure.webp',
          },
        ],
      },

      contactPage: {
        title: 'Contact Us',
        abort: 'Get in touch with us',

        location: 'Dhanbad Jharkhand',

        Principal: 'Abhishek Gupta (Principal)',
      },

      Login: {
        title: 'Login',
        paragraph:
          'Welcome to [Institute Name], an institution dedicated to fostering innovation, knowledge, and personal growth. Our mission is to shape tomorrow’s leaders by offering exceptional educational opportunities and encouraging intellectual exploration.',

        image:
          'https://s3-alpha-sig.figma.com/img/e725/38b8/a9f7d28b31be66c9f397e66d44dc014a?Expires=1739145600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pp-4heoCh9xd8YPItETDX~QTN~d0oDajeXwHshV9LANgMJ2TCbzVOjuQJXswljm1mSY8n-TBWOTLDXzrWye73unLce~c3hKEFVIeKUuxLxDluzjUbgVsHHC51tiRdwKVmt0zaH9Z5ds7VsUC4JwetWFPvNcCPFJIJvgVNog0XY~cSq~3fZyBW9Z2AdLzXyc6yxBHDMXhJvsP46oEFkuN-2QHjiAGNlqlTbS58OsHCgAlwJuNFSSHVyjDUiEpmvP1c2j-CKDZWJ1aDwt0bKSTw-ejUJlqkfUHgVMytTjri7m46ksdSMgC7WcSMKXBMZ5vwa5qurKRTyZREVOgOrHeXA__',
      },

      Sign_Up: {
        title: 'Sign Up',

        image:
          'https://s3-alpha-sig.figma.com/img/9e53/f389/4c758a66dbf9be2bba871477a57a44ff?Expires=1739145600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=DE2qNFEd3fj5XMZeA4EYhLs4oUXu7VG9IjMEScYw6wkTQPaQtlKJI4o1z5cTda2gxD7HF93P2BX1TFR2ntcbdZj-7yNItn~PXbKmEXAjN4PFrj0S6ume~1t7sXBsf5aGhM9UPz8h76symhPdCE3RZT2wVc0OX9vb3ZsDG0nIXt73UcihxzNEQ5tF9kEN6oX5oCW9WvuQHB7k-PMZP4nAAIRyVO5aXYlRTreqfXh-u~ECWdl6oE2T5xRfUkrYjasdJwi0XQ2-jGg~bfvrNX1WV207krTE0UPECiEJtf5RUCcquoM2IE8CnmFNnODxC-K~I9S1DIdtRgKERQlH7un1qw__',
      },
    });

    return Created_Frontend;
  } catch (error) {
    return error;
  }
};

export const sendMail = async ({ recipientEmail, subject, name, html }) => {
  try {
    let MailSend_toUser = await createTransport().sendMail({
      from: `"MERN Coding School"  ${process.env.GMAIL_User}>`,
      to: `${name}  ${recipientEmail}`,
      subject: subject,
      html: `${html}`,
    });

    if (!MailSend_toUser) {
      throw new Error('Email not sent');
    }

    return MailSend_toUser;
  } catch (error) {
    return error;
  }
};

export const createRole = async (email) => {
  try {
    let Create_Admin = Admin_Role.create({
      email: email,
    });

    return Create_Admin;
  } catch (error) {
    return new Error(error.message || 'Failed to create Admin Role');
  }
};

export const create_Notice = async ({ title, content, doc_link, type }) => {
  try {
    let Created_Notice = await Notice.create({
      title: title,
      content: content,
      doc_link: doc_link,
      type: type,
    });
    return Created_Notice;
  } catch (error) {
    return new Error(error.message || 'Failed to create Notice');
  }
};

export const update_Social_Link = async (data) => {};

export const create_Album = async () => {};

export const create_Image = async (data) => {};

export const create_Course = async (data) => {};

export const create_Teacher = async (data) => {
  try {
    console.log('data', data);
    let {
      name,
      email,
      image,
      role,
      facebook,
      linkedin,
      twitter,
      Specialization,
      Experience,
      instagram,
    } = data;

    let Teacher = await TeacherSchema.create({
      name: name,
      email: email,
      image: image,
      role: role,
      Specialization: Specialization,
      Experience: Experience,
      social_media: [
        {
          facebook: facebook,
          linkedin: linkedin,
          twitter: twitter,
          instagram: instagram,
        },
      ],
    });

    if (!Teacher) {
      return new Error('Failed to create Teacher');
    }

    return Teacher;
  } catch (error) {
    return new Error(error.message || 'Error Creating Teacher');
  }
};

export const Update_Status = async ({
  uniqueId,
  message,
  applicationStatus,
}) => {
  console.log('message', message, 'application Status', applicationStatus);

  try {
    let Find_Student = await Admission.findOne({ uniqueId: uniqueId });
    console.log(Find_Student.uniqueId);
    if (!Find_Student) {
      throw new Error('Fail To find Student');
    }

    let Update_Status = await status.findOneAndUpdate(
      { student_id: Find_Student._id.toString() },
      {
        $set: {
          message: message,
          applicationStatus: applicationStatus,
        },
      },
      { new: true }
    );
    console.log(Update_Status);

    if (!Update_Status) {
      throw new Error('Fail to Update Status');
    }
    return Update_Status;
  } catch (error) {
    throw new Error(error.message || 'Fail to Update Status');
  }
};
