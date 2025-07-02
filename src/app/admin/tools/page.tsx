
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Admin Tools</h3>
        <p className="text-sm text-muted-foreground">
          Useful utilities to help manage your site content.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Image to URL Converter</CardTitle>
            <CardDescription>
                This tool has been disabled because Firebase Storage is not configured for this project.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4 rounded-md border border-dashed border-destructive/50 p-6 text-destructive">
                <AlertTriangle className="h-8 w-8" />
                <p>To upload images and get URLs, a file storage service (like Firebase Storage) must be enabled and correctly configured in your Firebase project and environment variables.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
