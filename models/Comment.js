const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema(
  {
    // Set custome id to avoid confusion with parent comment _id.
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
    },
    commentBody: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    replies: [ReplySchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual to get the total reply count. Will be used later to combine the reply count with the comment count, so users get the full picture of the discussion.
CommentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
