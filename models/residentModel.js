import mongoose from "mongoose";

const residentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: null,
      },

      barangay: {
        type: String,
        trim: true,
        default: null,
      },

      city: {
        type: String,
        trim: true,
        default: null,
      },

      province: {
        type: String,
        trim: true,
        default: null,
      },
    },
    
    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Resident = mongoose.model("Resident", residentSchema);
export default Resident;