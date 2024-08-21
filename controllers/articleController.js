const Article = require("../models/article");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const userController = require("./userController");
const jwt = require("jsonwebtoken");

// Handle Post create on POST.
exports.article_create_post = [
  userController.obtainToken,
  (req, res, next) => {
    jwt.verify(req.token, "iepiep", (err, authData) => {
      if (err) {
        res.sendStatus(403);
        //res.send(authData);
      } else {
        /*         res.json({
          message: "Post created...",
          authData,
        }); */
        next();
      }
    });
  },
  // Validate and sanitize fields.
  body("title", "Post title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Post text must not be empty.").isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    console.log(req.body.author);
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const article = new Article({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
      isPublished: true,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      return res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Data from form is valid. Save item.
      await article.save();
      return res.send(article);
    }
  }),
];

exports.article_list = asyncHandler(async (req, res, next) => {
  const allArticles = await Article.find(
    { isPublished: true },
    "title text author rawText date"
  )
    .sort({ title: 1 })
    .populate("author")
    .exec();

  const allPosts = allArticles.map((article) => {
    console.log(article.date);
    const dateFormatted = article.date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `# ${article.title}

\_${dateFormatted} by [${article.author.firstName} ${article.author.lastName}](/)_

${article.text}`;
  });
  return res.send(allPosts);
});

exports.user_articles_list = [
  userController.obtainToken,
  (req, res, next) => {
    jwt.verify(req.token, "iepiep", (err, authData) => {
      if (err) {
        res.sendStatus(403);
        //res.send(authData);
      } else {
        /*         res.json({
          message: "Post created...",
          authData,
        }); */
        next();
      }
    });
  },
  asyncHandler(async (req, res, next) => {
    const userArticles = await Article.find(
      { author: req.params.userId },
      "title isPublished date rawText"
    )
      .sort({ title: 1 })
      .exec();
    return res.send(userArticles);
  }),
];

exports.article_toggle_published = [
  userController.obtainToken,
  (req, res, next) => {
    jwt.verify(req.token, "iepiep", (err, authData) => {
      if (err) {
        res.sendStatus(403);
        //res.send(authData);
      } else {
        /*         res.json({
          message: "Post created...",
          authData,
        }); */
        next();
      }
    });
  },
  asyncHandler(async (req, res, next) => {
    let updatedArticle = req.body.article;
    //console.log(updatedArticle);
    updatedArticle.isPublished = !updatedArticle.isPublished;
    const savedArticle = await Article.findByIdAndUpdate(
      updatedArticle._id,
      updatedArticle,
      {}
    );
    return res.send(savedArticle);
  }),
];

exports.article_delete = [
  userController.obtainToken,
  (req, res, next) => {
    jwt.verify(req.token, "iepiep", (err, authData) => {
      if (err) {
        res.sendStatus(403);
        //res.send(authData);
      } else {
        /*         res.json({
          message: "Post created...",
          authData,
        }); */
        next();
      }
    });
  },
  asyncHandler(async (req, res, next) => {
    await Article.findByIdAndDelete(req.body.articleID);
    return res.send(JSON.stringify("article deleted"));
  }),
];
