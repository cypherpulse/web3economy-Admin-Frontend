import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function PageHeader({
  title,
  description,
  onAdd,
  addLabel = 'Add New',
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{description}</p>
        )}
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}
