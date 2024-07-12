import mongoose from "mongoose";

// Schema per la struttura dei commenti
const commentSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true},
  content: { type: String, required: true},
},
{
  timestamps: true,
  _id: true
}
);

// Schema per la struttura dei post
const blogPostSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    author: { type: String, required: true }, // email dell'autore
    content: { type: String, required: true },
    comments: [commentSchema],
  }, {
    timestamps: true,
    collection: "blogPosts"
});

export default mongoose.model('BlogPost', blogPostSchema);