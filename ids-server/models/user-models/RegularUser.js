import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { mainDatabase } from "../../databases/Database.js";

const SALT_ROUNDS = 10;

const regularUserSchema = new mongoose.Schema(
  {
    organization_id: { type: mongoose.Schema.Types.ObjectId },
    avatar: { type: Array },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    mobile_no: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    status: {
      type: String,
      default: "Active",
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
    },

    permissions: {
      type: [mongoose.Schema.Types.ObjectId],
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifyToken: String,
    verifyTokenExpiry: Date,

    resetToken: String,
    resetTokenExpiry: Date,

    deletionToken: String,
    deletionTokenExpiry: Date,

    setPasswordToken: String,
  },
  { timestamps: true }
);

regularUserSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
  }
});

regularUserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return bcrypt.compare(String(enteredPassword), this.password);
};

const RegularUser = mainDatabase.model("user", regularUserSchema);

export default RegularUser;
