import Admission from '../Admission/Admission.model.mjs';
import Fee from './fee.model.mjs';
import Crypto from 'crypto';

class Fee_Service {
  Update_Student_fee = async ({
    uniqueId,
    Paid_amount,
    totalFee,
    paymentId,
    paymentMethod,
    PaymentType,
  }) => {
  
    try {
   

      console.log('Payment Type:', PaymentType);
      // Await the findOne call
      let foundStudent = await Admission.findOne({ uniqueId: uniqueId });

      if (!foundStudent) {
        throw new Error('Student not found');
      }

      // Ensure fee object exists
      let currentPaid = foundStudent.fee?.amount_paid || 0;
      let currentDue = foundStudent.fee?.amount_due || (totalFee - currentPaid);

      let updatedFee = await Admission.findOneAndUpdate(
        { uniqueId: uniqueId },
        {
          $set: {
            'fee.amount_paid': Number(currentPaid) + Number(Paid_amount),
            'fee.amount_due': Number(currentDue) - Number(Paid_amount),
          },
        },
        { new: true, runValidators: true }
      );

      if(!updatedFee){
        throw new Error('Failed to update fee for the student');
      }

      let feeCreate = await Fee.create({
        uniqueId: uniqueId,
        studentId: foundStudent._id,
        amountPaid: Paid_amount,
        totalFee: totalFee,
        dueFee: currentDue - Paid_amount,
        PaymentType: PaymentType,
        paymentMethod: paymentMethod,
        PaymentId: paymentId || `PAY-${Crypto.randomBytes(16).toString('hex')}`,
      });

      return feeCreate;

    } catch (error) {
      console.log('Error:', error);
      throw new Error(error.message || 'Failed to Update Fee');
    }
  };


  get_StudentBillByPaymentId = async (paymentId) => {
    try {
      let studentBill = await Fee.aggregate([
        {
          $match: {
            PaymentId: paymentId,
          },
         
        
        },
        {
          $lookup: {
            from: 'admissions',
            localField: 'studentId',
            foreignField: '_id',
            as: 'studentInfo',
          }
         

        },{
          $unwind: '$studentInfo',
         
        },{
          $lookup: {
            from: 'courses',
            localField: 'studentInfo.course_Id',
            foreignField: '_id',
            as: 'CourseDetail',
          },
        },{
          $unwind: '$CourseDetail',
        },
        {
          $project: {
          Date: '$paymentDate',
          BillNo: '$PaymentId',
          CourseName: '$CourseDetail.courseName',
          Semester: '$studentInfo.semester',
          StudentName: {
            $concat: [
              '$studentInfo.student.firstName',
              ' ',
              '$studentInfo.student.lastName',
            ],
          },
          StudentId: '$studentInfo.uniqueId',
          paymentMethod: '$paymentMethod',
          PaymentStatus: '$status',
          PaymentType: '$PaymentType',
          AmountPaid: '$amountPaid',
        }
      }
      ])
    if (studentBill.length === 0) {
        throw new Error('No student bill found for the provided payment ID');
      }
      return studentBill;
    } catch (error) {
      console.error('Error in get_StudentBillByPaymentId:', error);
      throw new Error(error.message || 'Failed to fetch student bill by payment ID');
    }
  };

}

export default new Fee_Service();
