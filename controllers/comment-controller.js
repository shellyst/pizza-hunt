const { json } = require("express/lib/response");
const { Comment, Pizza } = require("../models");

const commentController = {
  // Add comment to pizza.
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        //   Add the comment to a pizza.
        return Pizza.findByIdAndUpdate(
          { _id: params.pizzaId },
          // Use $push method to add comment's _id to the psecific pizza we want to update - adds data to an array.
          { $push: { comments: _id } },
          //   Means we are receiving the updated pizza.
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id." });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //  Updating an existing comment.
  // Passing params as a parameter, so make sure pass it to addRepl.
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  // Using $pull operator to remove the specific reply from the replies where replyId matches the value of params.replyId.
  removeReply({ params }, res) {
    Comment.findOneAndDelete(
      { _id: params.commentId },
      {
        $pull: {
          replies: { replyId: params.replyId },
        },
      },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },

  // Remove comment.
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res
            .status(404)
            .json({ message: "No comment found with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
