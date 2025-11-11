// Small bootstrap change: attempt to preload a TensorFlow-enabled model file (non-blocking).
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Attempt to enable TF model on startup (non-blocking).
// Put model files under /public/model/model.json + weight shards for serving.
import { enableTensorflowModel } from "@/utils/aiAdapter";

async function bootstrap() {
  try {
    // Non-blocking: we do not await here to avoid delaying app start.
    enableTensorflowModel("/model/model.json").then((loaded) => {
      if (loaded) console.info("AI model available for inference");
      else console.info("AI model unavailable; using rule-based engine");
    });
  } catch (err) {
    console.warn("Error attempting to enable AI model", err);
  }

  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();