import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
}

export default function DataTable({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: DataTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key] ?? '-'}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No data found
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((item, index) => (
              <div key={item.id || index} className="p-4 space-y-3">
                {columns.map((column) => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{column.label}:</span>
                    <span className="text-sm">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key] ?? '-'}
                    </span>
                  </div>
                ))}
                {(onEdit || onDelete || onView) && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
