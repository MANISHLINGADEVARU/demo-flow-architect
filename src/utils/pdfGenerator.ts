import jsPDF from 'jspdf';
import { PatientData } from './diagnosticEngine';

interface DiagnosticResultsData {
  primaryDiagnosis: string;
  confidence: number;
  riskLevel: string;
  triageCategory: string;
  recommendations: string[];
  vitalsAnalysis: any;
  differentialDiagnoses: Array<{ condition: string; probability: number }>;
  nextSteps: {
    timeframe: string;
    immediateActions: string[];
  };
}

export const generateMedicalReportPDF = (
  patientData: PatientData,
  diagnosticResults: DiagnosticResultsData
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL DIAGNOSTIC REPORT', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('MedSat AI Triage System - Preliminary Diagnosis', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;

  // Patient Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient ID: ${patientData?.patientId || 'P-2024-001'}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Age: ${patientData?.age || '45'} years`, 20, yPosition);
  yPosition += 6;
  doc.text(`Gender: ${patientData?.gender || 'Male'}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Assessment Time: ${new Date().toLocaleTimeString()}`, 20, yPosition);
  yPosition += 15;

  // Primary Complaint Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIMARY COMPLAINT', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const complaint = patientData?.primarySymptoms || 'Chest pain with shortness of breath';
  const splitComplaint = doc.splitTextToSize(complaint, pageWidth - 40);
  doc.text(splitComplaint, 20, yPosition);
  yPosition += (splitComplaint.length * 6) + 10;

  // Vital Signs Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VITAL SIGNS', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (diagnosticResults.vitalsAnalysis) {
    Object.entries(diagnosticResults.vitalsAnalysis).forEach(([key, vital]: [string, any]) => {
      const vitalName = key.replace(/([A-Z])/g, ' $1').toUpperCase();
      doc.text(`${vitalName}: ${vital.value} (Status: ${vital.status})`, 20, yPosition);
      yPosition += 6;
    });
  }
  yPosition += 10;

  // Primary Diagnosis Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI DIAGNOSTIC ANALYSIS', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Primary Diagnosis:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(diagnosticResults.primaryDiagnosis, 20, yPosition);
  yPosition += 8;

  doc.text(`AI Confidence Level: ${diagnosticResults.confidence}%`, 20, yPosition);
  yPosition += 8;
  doc.text(`Risk Level: ${diagnosticResults.riskLevel}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Triage Category: ${diagnosticResults.triageCategory}`, 20, yPosition);
  yPosition += 15;

  // Recommendations Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Immediate Recommendations:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  diagnosticResults.recommendations.forEach((rec, index) => {
    const splitRec = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
    doc.text(splitRec, 20, yPosition);
    yPosition += (splitRec.length * 6) + 2;
  });
  yPosition += 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Differential Diagnoses Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Differential Diagnoses:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  diagnosticResults.differentialDiagnoses.forEach((diagnosis, index) => {
    doc.text(`${index + 1}. ${diagnosis.condition} (${diagnosis.probability}% probability)`, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 15;

  // Next Steps Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Next Steps:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Timeline: ${diagnosticResults.nextSteps.timeframe}`, 20, yPosition);
  yPosition += 8;

  doc.text('Immediate Actions:', 20, yPosition);
  yPosition += 6;

  diagnosticResults.nextSteps.immediateActions.forEach((action, index) => {
    const splitAction = doc.splitTextToSize(`• ${action}`, pageWidth - 40);
    doc.text(splitAction, 25, yPosition);
    yPosition += (splitAction.length * 6) + 2;
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a preliminary AI-generated diagnosis. Professional medical consultation is required.', 
    pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  // Generate filename
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const filename = `Medical_Report_${patientData?.patientId || 'P2024001'}_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};