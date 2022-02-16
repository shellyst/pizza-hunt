const { Schema, model } = require("mongoose");

// Define the fields with data types.
const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  //   Setting a default value.
  createAt: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  //   Could also specify Array instead of [].
  toppings: [],
});

// Create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// Export the Pizza model
module.exports = Pizza;
