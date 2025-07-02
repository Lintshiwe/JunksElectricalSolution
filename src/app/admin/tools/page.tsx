
import { ImageUrlConverter } from '@/components/image-url-converter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
                Upload an image to Firebase Storage to get a permanent URL. You can use this URL anywhere on your site.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ImageUrlConverter />
        </CardContent>
      </Card>
    </div>
  );
}
