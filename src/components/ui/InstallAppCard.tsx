import { Download, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallAppCard() {
  const { canInstall, installed, needsManualInstall, isIOS, promptInstall } = useInstallPrompt();

  if (installed) return null;

  if (canInstall) {
    return (
      <Button onClick={promptInstall} variant="outline" className="w-full">
        <Download className="h-4 w-4 mr-2" /> INSTALL APP
      </Button>
    );
  }

  if (needsManualInstall) {
    return (
      <Card className="tactical-border">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-heading font-semibold flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" /> Install this app!
          </p>
          <p className="text-xs text-foreground">
            {isIOS ? (
              <>Tap <Share className="h-3 w-3 inline" /> Share, then <strong>"Add to Home Screen"</strong>.</>
            ) : (
              <>In Safari's menu bar, go to <strong>File → Add to Dock</strong>.</>
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return null; // not installable on this browser/platform at all
}