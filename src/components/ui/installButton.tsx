import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";

const InstallButton = () => {
  const { canInstall, installed, promptInstall } = useInstallPrompt();

  if (installed || !canInstall) return null;

  return (
    <Button onClick={promptInstall} variant="outline" className="w-full">
      <Download className="h-4 w-4 mr-2" /> INSTALL APP
    </Button>
  );
}

export default InstallButton