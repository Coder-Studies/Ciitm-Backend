import Admission from '../Admission/Admission.model.mjs';
import Fee from './fee.model.mjs';

class Fee_Utils {
  Find_Fee_By_StudentId = async (uniqueId) => {
    return Admission.findOne({ uniqueId }).select(
      'uniqueId student.firstName student.lastName student.middleName student.email student.contactNumber student.avtar fee isAdmitted semester course_Id'
    );
  };

  Get_Earnings_By_Course_Semester_Year = async ({
    course,
    semester,
    startDate,
    endDate,
  }) => {
    try {
      const earnings = await Fee.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        },
        {
          $lookup: {
            from: 'admissions',
            localField: 'uniqueId',
            foreignField: 'uniqueId',
            as: 'studentInfo',
          },
        },
        { $unwind: '$studentInfo' },
        {
          $match: {
            'studentInfo.course_Id': course,
            'studentInfo.semester': Number(semester),
          },
        },
        {
          $project: {
            _id: 0,
            paymentDate: 1,
            studentName: {
              $concat: [
                '$studentInfo.student.firstName',
                ' ',
                '$studentInfo.student.lastName',
              ],
            },
            paymentType: '$PaymentType',
            amount: '$amountPaid',
            status: {
              $cond: {
                if: { $gt: ['$dueFee', 0] },
                then: 'Pending',
                else: 'Completed',
              },
            },
          },
        },
      ]);
      return earnings;
    } catch (error) {
      console.error('Error in Get_Earnings_By_Course_Semester_Year:', error);
      throw Error(error.message);
    }
  };

  Get_Earnings_By_Date_Range = async ({ startDate, endDate }) => {
    try {
      const earnings = await Fee.aggregate([
        {
          $match: {
            paymentDate: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        },
        {
          $lookup: {
            from: 'admissions',
            localField: 'uniqueId',
            foreignField: 'uniqueId',
            as: 'studentInfo',
          },
        },
        { $unwind: '$studentInfo' },
        {
          $project: {
            _id: 0,
            paymentDate: 1,
            studentName: {
              $concat: [
                '$studentInfo.student.firstName',
                ' ',
                '$studentInfo.student.lastName',
              ],
            },
            paymentType: '$PaymentType',
            Payment_id: '$PaymentId',
            amount: '$amountPaid',
            status: '$status',
          },
        },
      ]);
      console.log('Earnings fetched:', earnings);
      return earnings;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  TOTAL_FEE_PAID_BY_UNIQUE_ID = async (uniqueId) => {
    let fee = Admission.findOne({ uniqueId }).select(
      'fee.course_Fee fee.amount_paid , fee.amount_due , _id'
    );
    return fee;
  };

  TOTAL_FEE_PAID = async () => {
    try {
      let TOTAL_ADMISSION = await Admission.find({});

      let Total_AMOUNT = 0;
      for (let i = 0; i < TOTAL_ADMISSION.length; i++) {
        Total_AMOUNT += TOTAL_ADMISSION[i].fee.amount_paid;
      }
      return Total_AMOUNT;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new Fee_Utils();
