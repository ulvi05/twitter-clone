import { Schema } from "express-validator";

export const registerSchema: Schema = {
  fullName: {
    in: ["body"],
    isString: {
      errorMessage: "fullName must be a string",
    },
    notEmpty: {
      errorMessage: "fullName is required",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email must be a string",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    notEmpty: {
      errorMessage: "Username is required",
    },
  },
};
export const forgotPasswordSchema: Schema = {
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email must be a string",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
};

export const resetPasswordSchema: Schema = {
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
  token: {
    in: ["body"],
    isString: {
      errorMessage: "Token must be a string",
    },
    notEmpty: {
      errorMessage: "Token is required",
    },
  },
};
