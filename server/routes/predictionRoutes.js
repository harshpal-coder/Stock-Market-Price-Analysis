import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStockInsight } from '../controllers/predictionController.js';

const router = express.Router();

// 🔥 Gemini 3-agent based prediction route
router.post('/insight', generateStockInsight);

// ✅ Gemini Vision Image Test Route (Optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/gemini-image-check", async (req, res) => {
  try {
    const imagePath = path.join(__dirname, "../assets/test.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Image,
                },
              },
              {
                text: "What do you see in this image?"
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.status(200).json({
      message: text,
      status: "Gemini Vision API is working ✅"
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: "Gemini Vision test failed ❌",
      details: err.response?.data?.error?.message || err.message
    });
  }
});

export default router;
