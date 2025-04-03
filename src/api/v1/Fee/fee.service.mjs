class Fee_Service {
  update_Student_Fee = async ({ uniqueId, Paid_amount }) => {
    try {
      let find_Student_fee;
    } catch (error) {}
  };
}

export let Update_Student_fee = async ({ uniqueId, Paid_amount }) => {
  try {
    let find_Student_fee = await AdmissionSchema.findOne({
      uniqueId: uniqueId,
    }).select('fee');

    console.log('find_Student_fee:', find_Student_fee);

    if (!find_Student_fee) {
      throw new Error('Student Fee not found');
    }

    let { amount_due, amount_paid } = find_Student_fee.fee;

    // Calculate the new paid amount and due amount
    let amount = Number(Paid_amount) + Number(amount_paid); // Ensure both are numbers
    let Due_Amount = Number(amount_due) - Number(Paid_amount); // Ensure both are numbers

    if (!Number.isFinite(amount) || !Number.isFinite(Due_Amount)) {
      throw new Error('Amount and Due Amount must be valid finite numbers');
    }

    // Perform the update

    // Check if the update was successful
    if (Update_Fee.nModified === 0) {
      // nModified tells if any document was modified
      return false;
    }

    return Update_Fee;
  } catch (error) {
    console.log('Error:', error);
    throw new Error(error.message || 'Failed to Update Fee');
  }
};
