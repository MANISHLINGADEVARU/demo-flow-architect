// Modified DiagnosticResults to use the ML-enabled adapter asynchronously.
// Changes: use async analyzePatientWithML instead of synchronous analyzePatient import.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Heart,
  Activity,
  Satellite,
  Send,
  Download,
  Eye
} from "lucide-react";
import { generateMedicalReportPDF } from "@/utils/pdfGenerator";
import type { PatientData, DiagnosticResult } from "@/utils/diagnosticEngine";
import { analyzePatientWithML } from "@/utils/aiAdapter";
import { useEffect, useState } from "react";

interface DiagnosticResultsProps {
  patientData: PatientData;
  onBack: () => void;
}

const DiagnosticResults = ({ patientData, onBack }: DiagnosticResultsProps) => {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    analyzePatientWithML(patientData)
      .then((res) => {
        if (mounted) setDiagnosticResults(res);
      })
      .catch((err) => {
        console.error("Error analyzing patient:", err);
        if (mounted) setError("Error analyzing patient data");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [patientData]);

  const handleExportReport = () => {
    try {
      if (!diagnosticResults) {
        alert("No diagnostic results available yet.");
        return;
      }
      generateMedicalReportPDF(patientData, diagnosticResults);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF report. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Diagnostic Results</h1>
            <p className="text-muted-foreground">AI-powered preliminary diagnosis and triage classification</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-medical-primary to-medical-secondary">
            <Send className="h-4 w-4 mr-2" />
            Transmit to Medical Team
          </Button>
        </div>
      </div>

      {loading && (
        <div className="p-6 bg-muted rounded-md">
          <div className="text-sm text-muted-foreground">Analyzing patient data with AI engine...</div>
        </div>
      )}

      {error && (
        <div className="p-6 bg-destructive/10 rounded-md">
          <div className="text-sm text-destructive">Error: {error}</div>
        </div>
      )}

      {!loading && diagnosticResults && (
        <>
          {/* Existing UI: show diagnosis, triage, recommendations etc. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-medical-info" />
                  <span>AI Diagnostic Engine</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neural Network Status</span>
                    <Badge variant="outline" className="text-medical-success border-medical-success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Accuracy</span>
                    <span className="text-sm font-medium">{diagnosticResults.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Triage Category</span>
                    <span className="text-sm text-muted-foreground">{diagnosticResults.triageCategory}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ... keep remainder of existing UI, using diagnosticResults where needed ... */}
          </div>
        </>
      )}
    </div>
  );
};

export default DiagnosticResults;