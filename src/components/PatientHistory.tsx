import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar, FileText } from "lucide-react";

interface PatientHistoryProps {
  onBack: () => void;
}

const PatientHistory = ({ onBack }: PatientHistoryProps) => {
  // Mock patient history data
  const patientHistory = [
    {
      id: "P-2024-001",
      date: "2024-07-25",
      time: "14:30",
      patientName: "John Smith",
      age: 45,
      primaryComplaint: "Chest pain with shortness of breath",
      diagnosis: "Acute Coronary Syndrome",
      triage: "HIGH",
      status: "Transmitted",
      vitals: {
        bloodPressure: "160/95",
        heartRate: "105",
        temperature: "98.6°F",
        oxygenSat: "94%"
      }
    },
    {
      id: "P-2024-002", 
      date: "2024-07-25",
      time: "13:15",
      patientName: "Sarah Johnson",
      age: 32,
      primaryComplaint: "High fever and severe headache",
      diagnosis: "Viral Meningitis (suspected)",
      triage: "MEDIUM",
      status: "Completed",
      vitals: {
        bloodPressure: "110/70",
        heartRate: "95",
        temperature: "103.2°F",
        oxygenSat: "98%"
      }
    },
    {
      id: "P-2024-003",
      date: "2024-07-25", 
      time: "11:45",
      patientName: "Michael Brown",
      age: 28,
      primaryComplaint: "Mild headache and fatigue",
      diagnosis: "Tension Headache",
      triage: "LOW",
      status: "Completed",
      vitals: {
        bloodPressure: "120/80",
        heartRate: "72",
        temperature: "98.4°F", 
        oxygenSat: "99%"
      }
    }
  ];

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
      case 'Transmitted': return 'text-medical-info border-medical-info bg-medical-info/10';
      case 'Completed': return 'text-medical-success border-medical-success bg-medical-success/10';
      default: return 'text-muted-foreground border-border';
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
              <h1 className="text-3xl font-bold text-foreground">Patient History</h1>
              <p className="text-muted-foreground">View previous diagnostic assessments and reports</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                  <p className="text-2xl font-bold text-medical-primary">127</p>
                </div>
                <FileText className="h-8 w-8 text-medical-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-medical-danger">12</p>
                </div>
                <User className="h-8 w-8 text-medical-danger" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-medical-info">18</p>
                </div>
                <Calendar className="h-8 w-8 text-medical-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                  <p className="text-2xl font-bold text-medical-warning">8.5s</p>
                </div>
                <Clock className="h-8 w-8 text-medical-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Records */}
        <div className="space-y-6">
          {patientHistory.map((record) => (
            <Card key={record.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="text-lg">{record.patientName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {record.id} | Age: {record.age}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(record.triage)}>
                      {record.triage} PRIORITY
                    </Badge>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Assessment Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Assessment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Date/Time:</span> {record.date} at {record.time}
                      </div>
                      <div>
                        <span className="font-medium">Primary Complaint:</span> {record.primaryComplaint}
                      </div>
                      <div>
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Vital Signs</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">BP:</span> {record.vitals.bloodPressure}
                      </div>
                      <div>
                        <span className="text-muted-foreground">HR:</span> {record.vitals.heartRate} bpm
                      </div>
                      <div>
                        <span className="text-muted-foreground">Temp:</span> {record.vitals.temperature}
                      </div>
                      <div>
                        <span className="text-muted-foreground">O2 Sat:</span> {record.vitals.oxygenSat}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Actions</h4>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        View Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;