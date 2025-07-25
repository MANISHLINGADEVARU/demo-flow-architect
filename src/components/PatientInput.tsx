import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Heart, 
  Thermometer, 
  Activity, 
  Droplets,
  User,
  FileText,
  Stethoscope
} from "lucide-react";

interface PatientInputProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const PatientInput = ({ onSubmit, onBack }: PatientInputProps) => {
  const [formData, setFormData] = useState({
    // Patient Info
    patientId: '',
    age: '',
    gender: '',
    weight: '',
    
    // Vital Signs
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    
    // Symptoms
    primarySymptoms: '',
    secondarySymptoms: [],
    painLevel: '',
    symptomDuration: '',
    
    // Medical History
    allergies: '',
    medications: '',
    previousConditions: ''
  });

  const commonSymptoms = [
    'Chest Pain',
    'Shortness of Breath',
    'Nausea',
    'Dizziness',
    'Headache',
    'Fatigue',
    'Fever',
    'Abdominal Pain'
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        secondarySymptoms: [...prev.secondarySymptoms, symptom]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        secondarySymptoms: prev.secondarySymptoms.filter(s => s !== symptom)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-primary/5 to-medical-secondary/10 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patient Assessment</h1>
            <p className="text-muted-foreground">Collect patient data for AI-powered preliminary diagnosis</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-medical-primary" />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="Enter patient ID"
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-medical-info" />
                <span>Vital Signs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-medical-danger" />
                  <span>Heart Rate (bpm)</span>
                </Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="75"
                  value={formData.heartRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodPressure" className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-medical-primary" />
                  <span>Blood Pressure</span>
                </Label>
                <Input
                  id="bloodPressure"
                  placeholder="120/80"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-medical-warning" />
                  <span>Temperature (°C)</span>
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="98"
                  value={formData.oxygenSaturation}
                  onChange={(e) => setFormData(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  placeholder="16"
                  value={formData.respiratoryRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5 text-medical-secondary" />
                <span>Symptoms & Complaints</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primarySymptoms">Primary Complaint</Label>
                <Textarea
                  id="primarySymptoms"
                  placeholder="Describe the main symptoms or complaint..."
                  value={formData.primarySymptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, primarySymptoms: e.target.value }))}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Additional Symptoms (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {commonSymptoms.map(symptom => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.secondarySymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, painLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pain level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>{i} - {i === 0 ? 'No Pain' : i <= 3 ? 'Mild' : i <= 6 ? 'Moderate' : 'Severe'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptomDuration">Symptom Duration</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, symptomDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-medical-success" />
                <span>Medical History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  placeholder="List any known allergies..."
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications and dosages..."
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousConditions">Previous Medical Conditions</Label>
                <Textarea
                  id="previousConditions"
                  placeholder="List any previous medical conditions or surgeries..."
                  value={formData.previousConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousConditions: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-medical-primary to-medical-secondary hover:opacity-90 transition-opacity">
              Begin AI Analysis
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientInput;