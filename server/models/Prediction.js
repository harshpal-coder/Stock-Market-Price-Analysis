import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  imageUrl: String,
  sentiment: String,
  confidence: Number,
  geminiResponse: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
