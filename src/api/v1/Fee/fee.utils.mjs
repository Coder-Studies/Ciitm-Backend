import Admission from '../Admission/Admission.model.mjs';

class Fee_Utils {
  Update_Student_Fee = async ({ uniqueId, Paid_amount }) => {
    let Updated_Fee = Admission.updateOne(
      { uniqueId: uniqueId },
      {
        $set: {
          'fee.amount_paid': amount,
          'fee.amount_due': Due_Amount,
        },
      },
      {
        new: true,
      }
    );

    return Updated_Fee;
  };
}
