const router = require("express").Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/<pizzaId>
router.route("/:pizzaId").post(addComment);

router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

// /api/comments/<pizzaId>/<commentId>
// After deleting a comment, you need to know what pizza the comment originated from.
router.route("/:pizzaId/:commentId").delete(removeComment);

// "Go to this pizza, look at this comment, delete this reply."
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
