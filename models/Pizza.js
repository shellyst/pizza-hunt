const { Schema, model } = require("mongoose");
// Import function to format date.
const dateFormat = require("../utils/dateFormat");

// Define the fields with data types.
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    //   Setting a default value.
    createdAt: {
      type: Date,
      default: Date.now,
      // Every time we retrieve a pizza, the value in createdAt field will be formatted by the dateFormat().
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    //   Could also specify Array instead of [].
    toppings: [],
    // Tell Mongoose to expect ObjectId and tell it that its data comes from the Comment model.
    // ref property tells the Pizza model which documents to search to find the right comments.
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  // Add toJSON property so schema can use virutals.
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Get total count of comments and replies on retrieval.
// Reduce method tallies up the total of every comment with its replies. Takes two parameters - accumulator and a currentValue.
// Here the accumulator is the total, and the currentValue is comment. Walks through array and passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array.
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// Create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// Export the Pizza model
module.exports = Pizza;
