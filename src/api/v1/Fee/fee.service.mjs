import Admission from '../Admission/Admission.model.mjs';
import Fee from './fee.model.mjs';

class Fee_Service {
  Update_Student_fee = async ({
    uniqueId,
    Paid_amount,
    totalFee,
    paymentMethod,
  }) => {
    try {
      console.log(
        'Update_Student_fee called with: fee Service',
        uniqueId,
        Paid_amount,
        totalFee,
        paymentMethod,
      );

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
            'fee.amount_paid': currentPaid += Paid_amount,
            'fee.amount_due': currentDue -= Paid_amount,
          },
        },
        { new: true, runValidators: true }
      );

      if(!updatedFee){
        throw new Error('Failed to update fee for the student');
      }

      let feeCreate = await Fee.create({
        Unique_id: uniqueId,
        studentId: foundStudent._id,
        amountPaid: Paid_amount,
        totalFee: totalFee,
        dueFee: currentDue - Paid_amount,
        paymentMethod: paymentMethod,
      });

      return feeCreate;

    } catch (error) {
      console.log('Error:', error);
      throw new Error(error.message || 'Failed to Update Fee');
    }
  };
}

export default new Fee_Service();
