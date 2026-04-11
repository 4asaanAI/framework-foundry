import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { parseTaskMeta, PRIORITY_CONFIG, type TaskPriority } from "@/lib/tasks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRIORITY_DOTS: Record<string, string> = {
  P0: "bg-destructive",
  P1: "bg-warning",
  P2: "bg-primary",
  P3: "bg-muted-foreground",
};

interface Props {
  tasks: any[];
  onTaskClick: (task: any) => void;
}

export function TaskCalendarView({ tasks, onTaskClick }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const enriched = tasks.map(t => {
    const { meta } = parseTaskMeta(t.description || "");
    return { ...t, meta };
  });

  const getTasksForDay = (day: Date) =>
    enriched.filter(t => t.due_date && isSameDay(new Date(t.due_date), day));

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-semibold text-foreground">{format(currentMonth, "MMMM yyyy")}</h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, new Date());
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <Popover key={day.toISOString()}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "min-h-[80px] p-1.5 bg-card text-left flex flex-col transition-colors hover:bg-muted/50",
                    !inMonth && "opacity-40",
                    isToday && "ring-1 ring-primary ring-inset"
                  )}
                >
                  <span className={cn("text-xs font-medium mb-1", isToday ? "text-primary font-bold" : "text-foreground")}>
                    {format(day, "d")}
                  </span>
                  <div className="flex flex-wrap gap-0.5">
                    {dayTasks.slice(0, 4).map(t => (
                      <div key={t.id} className={cn("w-2 h-2 rounded-full", PRIORITY_DOTS[t.meta.priority] || PRIORITY_DOTS.P2)} title={t.title} />
                    ))}
                    {dayTasks.length > 4 && <span className="text-xs text-muted-foreground">+{dayTasks.length - 4}</span>}
                  </div>
                </button>
              </PopoverTrigger>
              {dayTasks.length > 0 && (
                <PopoverContent className="w-64 p-2" align="start">
                  <p className="text-xs font-semibold text-foreground mb-2">{format(day, "EEE, MMM d")}</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {dayTasks.map(t => (
                      <button
                        key={t.id}
                        onClick={() => onTaskClick(t)}
                        className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className={cn("w-2 h-2 rounded-full shrink-0", PRIORITY_DOTS[t.meta.priority] || PRIORITY_DOTS.P2)} />
                        <span className="text-xs text-foreground truncate">{t.title}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              )}
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
