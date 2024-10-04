const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Handle comment create
exports.comment_create = [
  // Validate and sanitize fields.
  body("text", "Comment text must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    // Validar que el articulo existe (mongoose deberia controlarlo, revisar!)
    const comment = new Comment({
      text: req.body.text,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Podrias invocar next(errors) i en el middleware siguiente gestionar los errores (mirar ejemplo whatsapp)
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Data from form is valid. Save item.
      await comment.save();
      return res.send("Comment saved!");
    }
  }),
];

exports.comment_delete = [
  userController.validateToken,
  asyncHandler(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.body.commentID);
    return res.send(JSON.stringify("comment deleted"));
  }),
];
