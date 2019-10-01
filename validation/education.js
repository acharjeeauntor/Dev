const Validator = require("validator");
const isEmptyCustom = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmptyCustom(data.school) ? data.school : "";
  data.degree = !isEmptyCustom(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmptyCustom(data.fieldofstudy)
    ? data.fieldofstudy
    : "";
  data.from = !isEmptyCustom(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = " school is required";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = " degree is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = " fieldofstudy is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date is required";
  }

  return {
    errors,
    isValid: isEmptyCustom(errors)
  };
};
