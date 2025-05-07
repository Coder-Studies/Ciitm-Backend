import Admission from "./Admission.model.mjs";

class Admission_Utils {
    FIND_NUMBER_OF_ADMISSION = async () => {
        try {
            let NUMBER_OF_ADMISSION = (await Admission.find({})).length;
            return NUMBER_OF_ADMISSION;
        } catch (error) {
            throw new Error(error.message);
        }
    };
}


export default new Admission_Utils();