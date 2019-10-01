const Validator = require("validator");
const isEmptyCustom = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmptyCustom(data.title) ? data.title : "";
  data.company = !isEmptyCustom(data.company) ? data.company : "";
  data.from = !isEmptyCustom(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company name is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date is required";
  }

  return {
    errors,
    isValid: isEmptyCustom(errors)
  };
};
