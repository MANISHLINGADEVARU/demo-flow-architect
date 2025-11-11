```markdown
# AI framework integration — install & setup

1) Install TensorFlow.js (optional)
   If you want browser-based TF inference, install the package:
   npm install @tensorflow/tfjs

   (If you do server-side inference, integrate a server model instead and update aiAdapter accordingly.)

2) Place your TFJS model files
   - Put model.json and weight shards under: public/model/model.json
   - Example deploy path in browser: /model/model.json

   Important: The feature vector and LABELS in src/utils/aiAdapter.ts must match the model's training preprocessing and class order.

3) Start the app
   npm install
   npm run dev

   The app will attempt to load the model at startup (non-blocking). If the model loads successfully, analyzePatientWithML will use it. Otherwise the code will fall back to the existing rule-based analyzePatient.

4) Train / convert model guidance
   - If your model is trained with TensorFlow (Python), export to a tfjs format using the tfjs converter:
     tensorflowjs_converter --input_format=tf_saved_model /path/to/saved_model /path/to/web_model
   - Ensure the model's output is a probability vector over the same LABELS order used in aiAdapter.ts.

5) CORS & hosting
   - When serving the model.json from a different origin, ensure CORS headers permit load.
   - When developing locally, simply placing model files in public/ is easiest.

6) Customization
   - Update the features array and LABELS in src/utils/aiAdapter.ts to exactly match your model's expected inputs/outputs.
   - If you prefer server-side inference, modify aiAdapter to call your inference endpoint and map the response to DiagnosticResult.
```