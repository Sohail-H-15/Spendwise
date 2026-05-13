// =============================================
//  SpendWise - Transaction Model (Mongoose)
//  Defines the shape of data stored in MongoDB
// =============================================

const mongoose = require("mongoose");

// Define the schema (structure) for a transaction document
const TransactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true, // removes extra whitespace
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    type: {
      type: String,
      enum: ["income", "expense"], // only these two values are allowed
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, // automatically sets to current date if not provided
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// Export the model so routes can use it
module.exports = mongoose.model("Transaction", TransactionSchema);
