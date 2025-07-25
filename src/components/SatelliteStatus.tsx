import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Satellite, 
  Wifi, 
  Signal, 
  Globe,
  Activity
} from "lucide-react";

const SatelliteStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: true,
    signalStrength: 95,
    latency: 180,
    satellites: 4,
    constellation: "LEO Network"
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      // Simulate slight variations in connection
      setConnectionStatus(prev => ({
        ...prev,
        signalStrength: Math.max(90, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
        latency: Math.max(150, Math.min(250, prev.latency + (Math.random() - 0.5) * 30))
      }));
      
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (strength: number) => {
    if (strength >= 90) return 'text-medical-success';
    if (strength >= 70) return 'text-medical-warning';
    return 'text-medical-danger';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 rounded-full transition-colors duration-300 ${
          i < bars 
            ? getSignalColor(strength).replace('text-', 'bg-')
            : 'bg-muted'
        }`}
        style={{
          height: `${(i + 1) * 4 + 4}px`
        }}
      />
    ));
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Compact Status Display */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Satellite 
            className={`h-5 w-5 ${
              connectionStatus.isConnected 
                ? 'text-medical-success' 
                : 'text-medical-danger'
            } ${isAnimating ? 'animate-pulse' : ''}`} 
          />
          {connectionStatus.isConnected && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-medical-success rounded-full animate-ping" />
          )}
        </div>
        
        {/* Signal Strength Bars */}
        <div className="flex items-end space-x-0.5 h-5">
          {getSignalBars(connectionStatus.signalStrength)}
        </div>
        
        <Badge 
          variant="outline" 
          className={`text-xs ${
            connectionStatus.isConnected 
              ? 'text-medical-success border-medical-success' 
              : 'text-medical-danger border-medical-danger'
          }`}
        >
          {connectionStatus.isConnected ? 'ONLINE' : 'OFFLINE'}
        </Badge>
      </div>

      {/* Detailed Status Card (Hidden on mobile, shown on hover/click) */}
      <div className="hidden lg:block group relative">
        <div className="cursor-pointer">
          <Globe className="h-4 w-4 text-muted-foreground hover:text-medical-primary transition-colors" />
        </div>
        
        <Card className="absolute right-0 top-8 w-64 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Satellite Network</span>
              <Badge variant="secondary" className="text-xs">{connectionStatus.constellation}</Badge>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signal Strength:</span>
                <span className={`font-medium ${getSignalColor(connectionStatus.signalStrength)}`}>
                  {connectionStatus.signalStrength.toFixed(0)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency:</span>
                <span className="font-medium">
                  {connectionStatus.latency.toFixed(0)}ms
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Satellites:</span>
                <span className="font-medium">{connectionStatus.satellites}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-medical-success" />
                  <span className="font-medium text-medical-success">Active</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Last update: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SatelliteStatus;