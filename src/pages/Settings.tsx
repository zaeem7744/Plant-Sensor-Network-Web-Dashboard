import { useState } from 'react';
import { Save, Server, Clock, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [uploadInterval, setUploadInterval] = useState('5000');
  const [cycleLength, setCycleLength] = useState('100');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    
    toast({
      title: 'Settings saved',
      description: 'Your configuration has been updated.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-semibold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your plant monitoring system
        </p>
      </div>

      {/* Backend Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Backend Configuration
          </CardTitle>
          <CardDescription>
            Configure the FastAPI backend connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backendUrl">Backend URL</Label>
            <Input
              id="backendUrl"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
            <p className="text-xs text-muted-foreground">
              The URL where your FastAPI backend is running
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sampling Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Sampling Configuration
          </CardTitle>
          <CardDescription>
            Configure sensor upload intervals and cycles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uploadInterval">Upload Interval (ms)</Label>
              <Input
                id="uploadInterval"
                type="number"
                value={uploadInterval}
                onChange={(e) => setUploadInterval(e.target.value)}
                placeholder="5000"
              />
              <p className="text-xs text-muted-foreground">
                How often the device sends data
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycleLength">Cycle Length</Label>
              <Input
                id="cycleLength"
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground">
                Number of uploads per cycle
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current system connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Frontend Status</span>
              <span className="flex items-center gap-2 text-sm text-leaf-medium">
                <span className="h-2 w-2 rounded-full bg-leaf-medium animate-pulse" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Backend API</span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                Mock Mode (No backend connected)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Database</span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                Using mock data
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            To connect to your FastAPI backend, ensure it's running at the configured URL.
            The backend handles SQLite storage and device communication.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
