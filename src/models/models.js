const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [4, "First name must be at least 4 characters long"],
      maxLength: [50, "First name must not exceed 50 characters"],
      required: [true, "Enter First Name"],
      match: [/^[a-zA-Z]+$/, "First name should contain only alphabets"],
    },
    lastName: {
      type: String,
      minLength: [4, "Last name must be at least 4 characters long"],
      maxLength: [50, "Last name must not exceed 50 characters "],
      match: [/^[a-zA-Z]+$/, "Last name should contain only alphabets"],
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be at least 0"],
      max: [120, "Age must not exceed 120"],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },
    about: {
      type: String,
      required: true,
      default: "Tell us about yourself...",
      validate(value) {
        if (value.length < 10) {
          throw new Error("About section must be at least 10 characters long");
        } else if (value.length > 500) {
          throw new Error("About section must not exceed 500 characters");
        } else if (value === "Tell us about yourself...") {
          throw new Error(
            "Please update the 'about' section with something meaningful"
          );
        }
      },
    },
    skills: {
      type: [String],
      required: [true, "Enter Your Skills"],
      validate(value) {
        if (value.length < 2) {
          throw new Error("You must enter at least 2 skills");
        } else if (value.length > 20) {
          throw new Error("You can enter a maximum of 20 skills");
        }
        value.forEach((skill) => {
          if (typeof skill !== "string" || skill.trim() === "") {
            throw new Error("Each skill must be a non-empty string");
          }
        });
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
