import mongoose from "mongoose";

const lguAdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    department: {
      type: String,
      trim: true,
      default: null,
    },

    position: {
      type: String,
      trim: true,
      default: null,
    },
    
    municipality: {
      type: String,
      trim: true,
      default: null,
    },

    province: {
      type: String,
      trim: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const LGUAdmin = mongoose.model("LGUAdmin", lguAdminSchema);

export default LGUAdmin;