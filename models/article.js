const mongoose = require("mongoose");
// const User = require("./user");

// a name, description, category, price, number-in-stock and URL

const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };
const ArticleSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, maxLength: 400 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean },
    date: { type: Date, default: Date.now },
  },
  opts
);

ArticleSchema.virtual("dateFormatted").get(function () {
  console.log(this.date);
  return this.date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

/* // Virtual for item's URL
ArticleSchema.virtual("rawText").get(async function () {
  const author = await User.findById(this.author).exec();
  return `# ${this.title}\n\n_${this.dateFormatted} by [${author.firstName} ${author.lastName}](/)_\n\n${this.text}\n`;
}); */

// Export model
module.exports = mongoose.model("Article", ArticleSchema);
