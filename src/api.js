/* eslint-disable camelcase */
import { pipeline, env } from "@xenova/transformers";

// Disable local models
env.allowLocalModels = false;

// Define model factories
// Ensures only one model is created of each type
class PipelineFactory {
  static task = null;
  static model = null;
  static quantized = null;
  static instance = null;

  constructor(tokenizer, model, quantized) {
    this.tokenizer = tokenizer;
    this.model = model;
    this.quantized = quantized;
  }

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, {
        quantized: this.quantized,
        progress_callback,

        // For medium models, we need to load the `no_attentions` revision to avoid running out of memory
        revision: this.model.includes("/whisper-medium")
          ? "no_attentions"
          : "main",
      });
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  const message = event.data;

  // API call to the Flask model hosted on Render
  const transcript = await transcribeViaAPI(
    message.audio,
    message.model,
    message.multilingual,
    message.quantized,
    message.subtask,
    message.language
  );

  if (transcript === null) return;

  // Send the result back to the main thread
  self.postMessage({
    status: "complete",
    task: "automatic-speech-recognition",
    data: transcript,
  });
});

// API call function for communication with Render Flask backend
const transcribeViaAPI = async (audio) => {
  const apiUrl = "https://dystalk_transcription-api.onrender.com/predict"; // Update with your Render API URL

  // Prepare form data for sending to API
  const formData = new FormData();
  formData.append("audio", audio); // Assuming audio file is in the correct format

  const params = {
    method: "POST",
    body: formData,
  };

  try {
    const response = await fetch(apiUrl, params);
    const result = await response.json();

    if (response.ok) {
      return result.data; //  API returns a 'data' field with the transcription result
    } else {
      console.error("Error in API response:", result);
      return null;
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
};

// class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
//   static task = "automatic-speech-recognition";
//   static model = null;
//   static quantized = null;
// }

// The transcription pipeline remains the same, can use transcribeViaAPI or the local pipeline
