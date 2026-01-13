import emailMisspelled from "email-misspelled";
import MailChecker from "mailchecker";
import disposableDomains from "disposable-email-domains/index.json";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as Yup from "yup";

const getValidString = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .min(3, `${field} must be at least 3 characters`)
    .matches(/^\S.*\S$/, `${field} cannot start or end with a space`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidPhone = (field: string, required: boolean = true) => {
  let schema = Yup.string().test("valid-phone", `Invalid ${field}`, (value) => {
    if (!value) return !required;

    const formatted = value.startsWith("+") ? value : `+${value}`;
    const phoneNumber = parsePhoneNumberFromString(formatted);

    return phoneNumber?.isValid() || false;
  });

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const typoChecker = emailMisspelled({
  domains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"],
});

// Convert disposable list to Set for fast lookup
const disposableSet = new Set(disposableDomains);
const suspiciousPattern =
  /(gmae|gmaill|outllok|tempm|mailnator|gamepec|fakeinbox|tempmail|yopmail|throwaway|guerrilla|10min)/i;

export const getValidEmail = (field: string, required = true) => {
  let schema = Yup.string()
    .email("Invalid email format")
    .matches(/^\S+$/, `${field} cannot contain spaces`)
    .test("no-disposable-email", "Temporary email not allowed", (value) => {
      if (!value) return true;
      const domain = value.split("@")[1]?.toLowerCase();
      if (!domain) return false;
      return !disposableSet.has(domain);
    })
    .test("mailchecker-block", "Temporary email not allowed", (value) => {
      if (!value) return true;
      return MailChecker.isValid(value);
    })
    .test("no-suspicious-pattern", "Suspicious email domain", (value) => {
      if (!value) return true;
      return !suspiciousPattern.test(value);
    })
    .test("no-typo", "Email domain seems incorrect", (value) => {
      if (!value) return true;
      const suggestion = typoChecker(value);
      return suggestion.length === 0;
    });

  if (required) {
    schema = schema.required(`${field} is required`);
  }

  return schema;
};

const getValidPassword = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .min(6, `${field} must be at least 6 characters`)
    .matches(/^\S+$/, `${field} cannot contain spaces`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidConfirmPassword = (
  field: string,
  passwordField: string = "password"
) => {
  return Yup.string()
    .required(`${field} is required`)
    .oneOf([Yup.ref(passwordField)], `${field} must match ${passwordField}`)
    .matches(/^\S+$/, `${field} cannot contain spaces`);
};

const getValidBool = (field: string, required: boolean = true) => {
  let schema = Yup.boolean().typeError(`${field} must be a boolean`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidContent = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .min(3, `${field} must be at least 3 characters`)
    .test(
      "no-leading-trailing-space",
      `${field} cannot start or end with a space`,
      (value) => {
        if (!value) return !required; // allow empty if optional
        return value.trim().length === value.length;
      }
    );

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

export const loginValidation = Yup.object({
  email: getValidEmail("Email"),
  password: getValidPassword("Password"),
});

export const registreValidation = Yup.object({
  name: getValidString("Your Name"),
  email: getValidEmail("Email"),
  mobile_no: getValidPhone("Mobile Number"),
  terms: getValidBool("Terms and Condition"),
  password: getValidPassword("Password"),
  confirm_password: getValidConfirmPassword("Confirm Password", "password"),
});

export const emailValidation = Yup.object({ email: getValidEmail("Email") });

export const userResetPasswordValidation = Yup.object({
  new_password: getValidPassword("New Password"),
  confirm_password: getValidConfirmPassword("Confirm Password", "new_password"),
});

export const userChangePasswordValidation = Yup.object({
  current_password: getValidPassword("Current Password"),
  new_password: getValidPassword("New Password"),
  confirm_password: getValidConfirmPassword("Confirm Password", "new_password"),
});

export const userUpdateValidation = Yup.object({
  name: getValidString("Your Name"),
  email: getValidEmail("Email"),
  mobile_no: getValidPhone("Mobile Number"),
  alt_mobile_no: getValidPhone("Alternate Mobile Number", false),
});

export const locationSettingValidation = Yup.object({
  address: getValidString("address"),
  pincode: getValidString("pincode"),
  country: getValidString("country"),
  state: getValidString("state"),
  city: getValidString("city"),
});

export const userCreateValidation = Yup.object({
  name: getValidString("Name"),
  email: getValidEmail("Email"),
  mobile_no: getValidPhone("Mobile Number"),
});
export const userEditValidation = Yup.object({
  name: getValidString("Name"),
  email: getValidEmail("Email"),
  mobile_no: getValidPhone("Mobile Number"),
});

export const statusValidation = Yup.object({
  status_name: getValidString("Status Name"),
  parent_status: getValidString("Parent Status"),
  description: getValidContent("Description", false),
});

export const organizationValidation = Yup.object({
  organization_name: getValidString("Organization Name"),
  members: getValidString("Members"),
});
export const QuestionSchema = Yup.object().shape({
  title: getValidString("Title"),
  questionText: getValidString("Question Script"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        label: getValidString("Label"),
        value: Yup.string().required("Value is generated automatically"),
        // CHANGE HERE: Use Yup.number() instead of getValidString
        point: Yup.number()
          .required("Approach is required")
          .typeError("Approach must be a number"),
      })
    )
    .min(2, "At least 2 options are required"),
});
