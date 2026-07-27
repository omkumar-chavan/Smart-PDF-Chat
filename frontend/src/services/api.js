import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const uploadPDF = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post("/pdf/upload", formData);

  return response.data;
};

export const askQuestion = async (question) => {
  const response = await API.post("/chat/", {
    question,
  });

  return response.data;
};