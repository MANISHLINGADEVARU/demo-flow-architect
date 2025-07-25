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

interface DiagnosticResultsProps {
  patientData: any;
  onBack: () => void;
}

const DiagnosticResults = ({ patientData, onBack }: DiagnosticResultsProps) => {
  // Simulated AI analysis results
  const diagnosticResults = {
    primaryDiagnosis: "Acute Coronary Syndrome (Suspected)",
    confidence: 87,
    riskLevel: "HIGH",
    triageCategory: "PRIORITY 1",
    recommendations: [
      "Immediate cardiac monitoring",
      "12-lead ECG within 10 minutes",
      "Administer aspirin 325mg if no contraindications",
      "Establish IV access",
      "Prepare for emergency cardiac catheterization"
    ],
    vitalsAnalysis: {
      heartRate: { value: 110, status: "elevated", normal: "60-100 bpm" },
      bloodPressure: { value: "150/95", status: "elevated", normal: "120/80 mmHg" },
      temperature: { value: 37.2, status: "normal", normal: "36.1-37.2°C" },
      oxygenSaturation: { value: 96, status: "low-normal", normal: "95-100%" }
    },
    differentialDiagnoses: [
      { condition: "Myocardial Infarction", probability: 65 },
      { condition: "Unstable Angina", probability: 22 },
      { condition: "Aortic Dissection", probability: 8 },
      { condition: "Pulmonary Embolism", probability: 5 }
    ],
    nextSteps: {
      immediateActions: [
        "Contact emergency medical team",
        "Initiate cardiac protocol",
        "Continuous monitoring"
      ],
      timeframe: "< 15 minutes"
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-medical-danger border-medical-danger bg-medical-danger/10';
      case 'MEDIUM': return 'text-medical-warning border-medical-warning bg-medical-warning/10';
      case 'LOW': return 'text-medical-success border-medical-success bg-medical-success/10';
      default: return 'text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'elevated': return 'text-medical-danger';
      case 'low': return 'text-medical-warning';
      case 'low-normal': return 'text-medical-warning';
      case 'normal': return 'text-medical-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-primary/5 to-medical-secondary/10 p-6">
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-medical-primary to-medical-secondary">
              <Send className="h-4 w-4 mr-2" />
              Transmit to Medical Team
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Diagnosis */}
            <Card className="border-l-4 border-l-medical-danger shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-medical-danger" />
                    <span>Primary Diagnosis</span>
                  </div>
                  <Badge className={`${getRiskColor(diagnosticResults.riskLevel)} font-semibold`}>
                    {diagnosticResults.riskLevel} RISK
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{diagnosticResults.primaryDiagnosis}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-muted-foreground">AI Confidence:</span>
                      <Progress value={diagnosticResults.confidence} className="w-32 h-2" />
                      <span className="text-sm font-medium">{diagnosticResults.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="bg-medical-danger/10 p-4 rounded-lg border border-medical-danger/20">
                    <h4 className="font-semibold text-medical-danger mb-2">Immediate Recommendations:</h4>
                    <ul className="space-y-1">
                      {diagnosticResults.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-medical-success mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-medical-info" />
                  <span>Vital Signs Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(diagnosticResults.vitalsAnalysis).map(([key, vital]) => (
                    <div key={key} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge variant="outline" className={getStatusColor(vital.status)}>
                          {vital.status}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold">{vital.value}</div>
                      <div className="text-xs text-muted-foreground">Normal: {vital.normal}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Differential Diagnoses */}
            <Card>
              <CardHeader>
                <CardTitle>Differential Diagnoses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {diagnosticResults.differentialDiagnoses.map((diagnosis, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">{diagnosis.condition}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={diagnosis.probability} className="w-24 h-2" />
                        <span className="text-sm font-medium w-10">{diagnosis.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Triage Classification */}
            <Card className="border-l-4 border-l-medical-danger">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-medical-danger" />
                  <span>Triage Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-danger mb-2">
                    {diagnosticResults.triageCategory}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Immediate medical attention required
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-medical-warning" />
                  <span>Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm font-medium text-medical-warning">
                    Timeline: {diagnosticResults.nextSteps.timeframe}
                  </div>
                  <ul className="space-y-2">
                    {diagnosticResults.nextSteps.immediateActions.map((action, i) => (
                      <li key={i} className="text-sm flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-medical-success mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Transmission Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Satellite className="h-5 w-5 text-medical-info" />
                  <span>Transmission Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satellite Link</span>
                    <Badge variant="outline" className="text-medical-success border-medical-success">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Signal Strength</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medical Team</span>
                    <Badge variant="outline" className="text-medical-warning border-medical-warning">
                      Standby
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> {patientData?.patientId || 'P-2024-001'}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {patientData?.age || '45'} years
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {patientData?.gender || 'Male'}
                  </div>
                  <div>
                    <span className="font-medium">Primary Complaint:</span> {patientData?.primarySymptoms || 'Chest pain with shortness of breath'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticResults;