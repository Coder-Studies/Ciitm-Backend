import Admission from '../Admission/Admission.model.mjs';

class Fee_Utils {
  Find_Fee_By_StudentId = async (uniqueId) => {
    return Admission.findOne({ uniqueId }).select(
      'uniqueId student.firstName student.lastName student.middleName student.email student.contactNumber student.avtar fee isAdmitted semester course_Id'
    );
  };

  TOTAL_FEE_PAID_BY_UNIQUE_ID = async (uniqueId) => {
    let fee = Admission.findOne({ uniqueId }).select(
      'fee.course_Fee fee.amount_paid , _id'
    );
    return fee;
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
