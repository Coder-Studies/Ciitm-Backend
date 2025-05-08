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

  TOTAL_FEE_PAID = async () => {
    try {
      let TOTAL_ADMISSION = await Admission.find({});
      console.log(TOTAL_ADMISSION);

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
