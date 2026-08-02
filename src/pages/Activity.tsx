import { useAppState } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Activity() {
  const { activity } = useAppState();

  return (
    <div className="space-y-5">
      <h2 className="text-3xl text-center">ACTIVITY FEED</h2>
      <Card className="tactical-border">
        <CardContent className="space-y-2 pt-4">
          {activity.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
          )}
          {activity.map((item) => (
            <div key={item.id} className="flex items-start gap-3 border-b border-border/50 pb-2 last:border-0">
              <span className={cn(
                "mt-1 h-2 w-2 rounded-full shrink-0",
                item.type === "alert" ? "bg-warning" : item.type === "status" ? "bg-safe" : "bg-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{item.memberName}</span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">{item.timestamp}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}