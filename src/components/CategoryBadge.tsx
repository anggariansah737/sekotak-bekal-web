import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  POPULER: "bg-primary text-primary-foreground",
  VEGAN: "bg-success text-success-foreground",
  "NUTRISI+": "bg-success-soft text-success",
  ANAK: "bg-accent text-accent-foreground",
  PEDAS: "bg-destructive text-destructive-foreground",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const style = styles[category] || "bg-muted text-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        style,
        className,
      )}
    >
      {category}
    </span>
  );
}
