import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const chatWithGemini = async (req: Request, res: Response) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: req.body.history || [],
    });

    const result = await chat.sendMessage(req.body.prompt);

    const responseText = await result.response.text();

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error in chatWithGemini:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

export default {
  chatWithGemini,
};
