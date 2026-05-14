import axiosInstance from "../axiosInstance";

interface ChatRequest {
  history: { role: string; parts: { text: string }[] }[];
  prompt: string;
}

export const geminiService = async (data: ChatRequest) => {
  const response = await axiosInstance.post("/gemini", data);
  return response.data;
};
