import { Building2 } from "lucide-react";

interface BaseHeaderProps {
  title: string;
  description: string;
}

export function BaseHeader({ title, description }: BaseHeaderProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-3 bg-primary rounded-xl">
        <Building2 className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}