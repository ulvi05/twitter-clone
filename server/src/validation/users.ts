import { Schema } from "express-validator";

export const findUserSchema: Schema = {
  id: {
    in: ["params"],
    isString: {
      errorMessage: "Id must be a string",
    },
    notEmpty: {
      errorMessage: "Id is required",
    },
  },
};

export const changeUserRoleSchema: Schema = {
  id: {
    in: ["params"],
    isString: {
      errorMessage: "Id must be a string",
    },
    notEmpty: {
      errorMessage: "Id is required",
    },
  },
  role: {
    in: ["body"],
    matches: {
      options: [/\b(?:admin|user)\b/],
      errorMessage: "Invalid role",
    },
    isString: {
      errorMessage: "Role must be a string",
    },
    notEmpty: {
      errorMessage: "Role is required",
    },
  },
};
