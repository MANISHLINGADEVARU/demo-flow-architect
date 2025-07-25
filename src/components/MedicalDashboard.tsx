import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Satellite, 
  Heart, 
  Thermometer, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Stethoscope
} from "lucide-react";
import PatientInput from "./PatientInput";
import DiagnosticResults from "./DiagnosticResults";
import SatelliteStatus from "./SatelliteStatus";

const MedicalDashboard = () => {
  const [currentStep, setCurrentStep] = useState<'overview' | 'input' | 'processing' | 'results'>('overview');
  const [patientData, setPatientData] = useState(null);

  const handlePatientSubmit = (data: any) => {
    setPatientData(data);
    setCurrentStep('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      setCurrentStep('results');
    }, 3000);
  };

  const systemStats = {
    connectivity: 98,
    activeSensors: 8,
    patientsMonitored: 24,
    responseTime: 12
  };

  if (currentStep === 'input') {
    return <PatientInput onSubmit={handlePatientSubmit} onBack={() => setCurrentStep('overview')} />;
  }

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-medical-primary/5 to-medical-secondary/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <Brain className="h-16 w-16 text-medical-primary mx-auto mb-4" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">AI Processing & Analysis</h2>
            <p className="text-muted-foreground">Analyzing patient data and generating preliminary diagnosis...</p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Symptom Analysis</span>
                  <CheckCircle className="h-4 w-4 text-medical-success" />
                </div>
                <Progress value={100} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vital Sign Processing</span>
                  <CheckCircle className="h-4 w-4 text-medical-success" />
                </div>
                <Progress value={100} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk Assessment</span>
                  <Clock className="h-4 w-4 text-medical-warning animate-spin" />
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Triage Classification</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return <DiagnosticResults patientData={patientData} onBack={() => setCurrentStep('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-primary/5 to-medical-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-medical-primary to-medical-secondary rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">MedSat AI Triage System</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Preliminary Diagnosis & Emergency Response</p>
              </div>
            </div>
            <SatelliteStatus />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-medical-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satellite Connectivity</p>
                  <p className="text-2xl font-bold text-medical-success">{systemStats.connectivity}%</p>
                </div>
                <Satellite className="h-8 w-8 text-medical-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-medical-info">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sensors</p>
                  <p className="text-2xl font-bold text-medical-info">{systemStats.activeSensors}</p>
                </div>
                <Activity className="h-8 w-8 text-medical-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-medical-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patients Monitored</p>
                  <p className="text-2xl font-bold text-medical-primary">{systemStats.patientsMonitored}</p>
                </div>
                <Users className="h-8 w-8 text-medical-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-medical-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold text-medical-warning">{systemStats.responseTime}s</p>
                </div>
                <Clock className="h-8 w-8 text-medical-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Assessment */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-medical-danger" />
                <span>Patient Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Begin preliminary diagnosis by collecting patient symptoms and vital signs through our integrated sensor network.
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setCurrentStep('input')}
                  className="bg-gradient-to-r from-medical-primary to-medical-secondary hover:opacity-90 transition-opacity"
                >
                  Start Assessment
                </Button>
                <Button variant="outline">View History</Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                  <span className="text-sm font-medium">94.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Model Update</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Diagnostic Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 min ago", patient: "Patient #A47", condition: "Chest Pain", triage: "High", status: "Completed" },
                { time: "15 min ago", patient: "Patient #B23", condition: "Fever", triage: "Medium", status: "Transmitted" },
                { time: "32 min ago", patient: "Patient #C91", condition: "Headache", triage: "Low", status: "Completed" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                    <div className="font-medium">{activity.patient}</div>
                    <div className="text-sm">{activity.condition}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${activity.triage === 'High' ? 'text-medical-danger border-medical-danger' : ''}
                        ${activity.triage === 'Medium' ? 'text-medical-warning border-medical-warning' : ''}
                        ${activity.triage === 'Low' ? 'text-medical-success border-medical-success' : ''}
                      `}
                    >
                      {activity.triage} Priority
                    </Badge>
                    <Badge variant="secondary">{activity.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalDashboard;