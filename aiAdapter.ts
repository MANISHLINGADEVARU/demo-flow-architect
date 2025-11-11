// Optional AI adapter - use TensorFlow.js inference if available, otherwise fall back to rule-based engine.
//
// How it works:
// - enableTensorflowModel(modelUrl) attempts to dynamically import @tensorflow/tfjs and load a model.
// - analyzePatientWithML(patientData) runs inference with the model when loaded, mapping outputs to the existing DiagnosticResult shape.
// - If TF or model is unavailable, the adapter imports and calls the existing rule-based analyzePatient implementation.
//
// IMPORTANT: The numeric feature vector and LABELS must match how the model was trained.
import type { PatientData, DiagnosticResult } from "./diagnosticEngine";

let tf: any = null;
let model: any = null;

/**
 * Attempt to load TensorFlow.js and a model from modelUrl.
 * Returns true if model successfully loaded, false otherwise.
 *
 * Example modelUrl: "/model/model.json" (place model files under /public/model/)
 */
export async function enableTensorflowModel(modelUrl: string = "/model/model.json"): Promise<boolean> {
  try {
    // dynamic import so we only pull tfjs when needed
    tf = await import("@tensorflow/tfjs");
    // loadLayersModel works for the typical tfjs Layers format (model.json + shard files)
    model = await tf.loadLayersModel(modelUrl);
    console.info("TensorFlow.js model loaded from", modelUrl);
    return true;
  } catch (err) {
    console.warn("TensorFlow.js or model load failed; using rule-based engine as fallback.", err);
    tf = null;
    model = null;
    return false;
  }
}

/**
 * Analyze patient using an ML model if available, otherwise fall back.
 * Returns a DiagnosticResult matching the existing structure.
 */
export async function analyzePatientWithML(patientData: PatientData): Promise<DiagnosticResult> {
  // If TF model isn't available, delegate to rule-based engine.
  if (!model || !tf) {
    const { analyzePatient } = await import("./diagnosticEngine");
    return analyzePatient(patientData);
  }

  try {
    // Example feature vector - MUST match training-time features.
    const features: number[] = [
      Number(patientData.age) || 0,
      Number(patientData.heartRate) || 0,
      Number(patientData.respiratoryRate) || 0,
      Number(patientData.temperature) || 0,
      Number(patientData.oxygenSaturation) || 0,
      Number(patientData.painLevel) || 0,
      // symptom flags (example - update to match training)
      patientData.primarySymptoms.toLowerCase().includes("chest") || patientData.primarySymptoms.toLowerCase().includes("pain") ? 1 : 0,
      patientData.secondarySymptoms.includes("Shortness of Breath") ? 1 : 0,
      patientData.secondarySymptoms.includes("Nausea") ? 1 : 0,
      patientData.secondarySymptoms.includes("Dizziness") ? 1 : 0,
      patientData.secondarySymptoms.includes("Fever") ? 1 : 0
    ];

    // Create tensor [1, features.length]
    const input = tf.tensor2d([features]);

    // Predict - model.predict can return a tensor or array of tensors
    let raw = model.predict(input);
    if (Array.isArray(raw)) raw = raw[0];

    const outData = await raw.data();
    const probs = Array.from(outData);
    const maxIdx = probs.indexOf(Math.max(...probs));
    const confidence = Math.round((probs[maxIdx] || 0) * 100);

    // Adjust labels to match your model's trained class order
    const LABELS = [
      "General Malaise",
      "Chest Pain - Non-Cardiac",
      "Cardiac Event (Possible)",
      "Acute Coronary Syndrome (Suspected)",
      "Respiratory Distress",
      "Febrile Illness"
    ];

    const diagnosis = LABELS[maxIdx] || "General Malaise";
    const riskLevel = confidence >= 80 ? "HIGH" : confidence >= 50 ? "MEDIUM" : "LOW";
    const triageCategory = riskLevel === "HIGH" ? "PRIORITY 1" : riskLevel === "MEDIUM" ? "PRIORITY 2" : "PRIORITY 3";

    // Build minimal vitals analysis (reuse logic from rule engine for display)
    const heartRate = parseInt(patientData.heartRate) || 0;
    const temperature = parseFloat(patientData.temperature) || 0;
    const oxygenSat = parseInt(patientData.oxygenSaturation) || 0;

    const vitalsAnalysis = {
      heartRate: {
        value: heartRate || "N/A",
        status: heartRate > 100 ? "elevated" : heartRate < 60 ? "low" : "normal",
        normal: "60-100 bpm"
      },
      temperature: {
        value: temperature || "N/A",
        status: temperature > 37.5 ? "elevated" : temperature < 36 ? "low" : "normal",
        normal: "36.1-37.2°C"
      },
      oxygenSaturation: {
        value: oxygenSat || "N/A",
        status: oxygenSat < 95 ? "low" : oxygenSat < 97 ? "low-normal" : "normal",
        normal: "95-100%"
      }
    };

    const recommendations =
      riskLevel === "HIGH"
        ? ["Immediate medical attention required", "Continuous monitoring", "Establish IV access"]
        : riskLevel === "MEDIUM"
        ? ["Monitor vital signs closely", "Consider pain management", "Reassess in 30 minutes"]
        : ["Standard monitoring protocol", "Symptomatic treatment", "Patient comfort measures"];

    const differentialDiagnoses = LABELS.map((label, idx) => ({
      condition: label,
      probability: Math.round((probs[idx] || 0) * 100)
    }));

    return {
      primaryDiagnosis: diagnosis,
      confidence,
      riskLevel: riskLevel as "LOW" | "MEDIUM" | "HIGH",
      triageCategory,
      recommendations,
      vitalsAnalysis,
      differentialDiagnoses: differentialDiagnoses.sort((a, b) => b.probability - a.probability),
      nextSteps: {
        immediateActions: recommendations.slice(0, 3),
        timeframe: riskLevel === "HIGH" ? "< 15 minutes" : riskLevel === "MEDIUM" ? "< 30 minutes" : "< 1 hour"
      }
    };
  } catch (err) {
    // On any inference error, fall back to rule-based engine
    console.error("ML inference error; falling back to rule-based analyzePatient", err);
    const { analyzePatient } = await import("./diagnosticEngine");
    return analyzePatient(patientData);
  }
}