// AI Diagnostic Engine - Processes patient data to generate diagnosis
export interface PatientData {
  patientId: string;
  age: string;
  gender: string;
  weight: string;
  heartRate: string;
  bloodPressure: string;
  temperature: string;
  oxygenSaturation: string;
  respiratoryRate: string;
  primarySymptoms: string;
  secondarySymptoms: string[];
  painLevel: string;
  symptomDuration: string;
  allergies: string;
  medications: string;
  previousConditions: string;
}

export interface DiagnosticResult {
  primaryDiagnosis: string;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  triageCategory: string;
  recommendations: string[];
  vitalsAnalysis: Record<string, any>;
  differentialDiagnoses: Array<{ condition: string; probability: number }>;
  nextSteps: {
    immediateActions: string[];
    timeframe: string;
  };
}

export const analyzePatient = (patientData: PatientData): DiagnosticResult => {
  // Parse vital signs
  const heartRate = parseInt(patientData.heartRate) || 0;
  const temperature = parseFloat(patientData.temperature) || 0;
  const oxygenSat = parseInt(patientData.oxygenSaturation) || 0;
  const respiratoryRate = parseInt(patientData.respiratoryRate) || 0;
  const painLevel = parseInt(patientData.painLevel) || 0;
  const age = parseInt(patientData.age) || 0;

  // Analyze symptoms for cardiac conditions
  const chestSymptoms = patientData.primarySymptoms.toLowerCase();
  const hasChestPain = chestSymptoms.includes('chest') || chestSymptoms.includes('pain');
  const hasBreathingIssues = chestSymptoms.includes('breath') || chestSymptoms.includes('shortness') || patientData.secondarySymptoms.includes('Shortness of Breath');
  const hasNausea = patientData.secondarySymptoms.includes('Nausea');
  const hasDizziness = patientData.secondarySymptoms.includes('Dizziness');
  const hasFever = patientData.secondarySymptoms.includes('Fever') || temperature > 37.5;

  // Calculate risk factors
  let riskScore = 0;
  let diagnosis = "General Malaise";
  let confidence = 65;

  // Cardiac risk assessment
  if (hasChestPain && (hasBreathingIssues || hasNausea || hasDizziness)) {
    riskScore += 40;
    if (heartRate > 100 || heartRate < 50) riskScore += 20;
    if (age > 45) riskScore += 15;
    if (painLevel >= 7) riskScore += 15;
    
    if (riskScore >= 70) {
      diagnosis = "Acute Coronary Syndrome (Suspected)";
      confidence = 85;
    } else if (riskScore >= 50) {
      diagnosis = "Cardiac Event (Possible)";
      confidence = 75;
    } else {
      diagnosis = "Chest Pain - Non-Cardiac";
      confidence = 70;
    }
  }
  
  // Respiratory conditions
  else if (hasBreathingIssues && (hasFever || respiratoryRate > 20)) {
    riskScore += 30;
    if (oxygenSat < 95) riskScore += 25;
    if (temperature > 38) riskScore += 20;
    
    diagnosis = "Respiratory Distress";
    confidence = 80;
  }
  
  // Fever-based conditions
  else if (hasFever) {
    riskScore += 20;
    if (temperature > 39) riskScore += 15;
    if (patientData.secondarySymptoms.includes('Headache')) riskScore += 10;
    
    diagnosis = "Febrile Illness";
    confidence = 75;
  }

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let triageCategory = "PRIORITY 3";
  
  if (riskScore >= 70) {
    riskLevel = 'HIGH';
    triageCategory = "PRIORITY 1";
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    triageCategory = "PRIORITY 2";
  }

  // Generate vitals analysis
  const vitalsAnalysis = {
    heartRate: {
      value: heartRate || 'N/A',
      status: heartRate > 100 ? 'elevated' : heartRate < 60 ? 'low' : 'normal',
      normal: '60-100 bpm'
    },
    bloodPressure: {
      value: patientData.bloodPressure || 'N/A',
      status: patientData.bloodPressure?.includes('1') && parseInt(patientData.bloodPressure.split('/')[0]) > 140 ? 'elevated' : 'normal',
      normal: '120/80 mmHg'
    },
    temperature: {
      value: temperature || 'N/A',
      status: temperature > 37.5 ? 'elevated' : temperature < 36 ? 'low' : 'normal',
      normal: '36.1-37.2°C'
    },
    oxygenSaturation: {
      value: oxygenSat || 'N/A',
      status: oxygenSat < 95 ? 'low' : oxygenSat < 97 ? 'low-normal' : 'normal',
      normal: '95-100%'
    }
  };

  // Generate recommendations based on diagnosis
  let recommendations: string[] = [];
  if (riskLevel === 'HIGH') {
    recommendations = [
      "Immediate medical attention required",
      "Continuous cardiac monitoring",
      "Establish IV access",
      "12-lead ECG within 10 minutes",
      "Contact emergency medical team"
    ];
  } else if (riskLevel === 'MEDIUM') {
    recommendations = [
      "Monitor vital signs closely",
      "Consider pain management",
      "Reassess in 30 minutes",
      "Prepare for potential escalation"
    ];
  } else {
    recommendations = [
      "Standard monitoring protocol",
      "Symptomatic treatment",
      "Patient comfort measures",
      "Regular reassessment"
    ];
  }

  // Generate differential diagnoses
  const differentialDiagnoses = [];
  if (hasChestPain) {
    differentialDiagnoses.push(
      { condition: "Myocardial Infarction", probability: Math.min(riskScore, 65) },
      { condition: "Unstable Angina", probability: Math.max(0, riskScore - 20) },
      { condition: "Musculoskeletal Pain", probability: 100 - riskScore },
      { condition: "Gastroesophageal Reflux", probability: Math.max(0, 40 - riskScore) }
    );
  } else if (hasBreathingIssues) {
    differentialDiagnoses.push(
      { condition: "Pneumonia", probability: Math.min(riskScore + 10, 70) },
      { condition: "Asthma Exacerbation", probability: Math.max(0, 60 - riskScore) },
      { condition: "Pulmonary Embolism", probability: Math.min(riskScore, 30) }
    );
  } else {
    differentialDiagnoses.push(
      { condition: "Viral Syndrome", probability: 60 },
      { condition: "Anxiety Disorder", probability: 25 },
      { condition: "Medication Side Effect", probability: 15 }
    );
  }

  return {
    primaryDiagnosis: diagnosis,
    confidence,
    riskLevel,
    triageCategory,
    recommendations,
    vitalsAnalysis,
    differentialDiagnoses: differentialDiagnoses.sort((a, b) => b.probability - a.probability),
    nextSteps: {
      immediateActions: recommendations.slice(0, 3),
      timeframe: riskLevel === 'HIGH' ? '< 15 minutes' : riskLevel === 'MEDIUM' ? '< 30 minutes' : '< 1 hour'
    }
  };
};