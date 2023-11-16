import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: [String],
    },
    intro: {
      type: String,
      required: true,
    },
    paragraphs: {
      type: [String],
      required: true,
      validate: [arrayLimit, 'Paragraphs array must have between 1 and 8 items'],
    },
    keywords: {
      type: [String],
      required: true,
    },
    image1: {
      type: String,
    },
    image2: {
      type: String,
    },
  });
  
  function arrayLimit(val) {
    return val.length >= 1 && val.length <= 8;
  }
  
const articleObj = mongoose.model('Article', articleSchema);
  
export default articleObj;