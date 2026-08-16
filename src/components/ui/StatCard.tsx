type DeltaTone = "success" | "danger" | "neutral";

const deltaToneClasses: Record<DeltaTone, string> = {
  success: "text-success-text",
  danger: "text-danger-text",
  neutral: "text-secondary",
};

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: DeltaTone;
}) {
  return (
    <div className="w-full rounded-content-card border border-hairline bg-canvas p-4">
      <p className="text-caption text-secondary">{label}</p>
      <p className="text-h1 text-foreground">{value}</p>
      {delta && (
        <p className={`text-caption font-medium ${deltaToneClasses[deltaTone]}`}>
          {delta}
        </p>
      )}
    </div>
  );
}
