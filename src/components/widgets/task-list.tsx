import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, ListTodo, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { toggleTask } from "@/services/task-service";
import { EMPTY_USER_DATA, useUserDataStore } from "@/store/user-data-store";
import { useQuickAddStore } from "@/store/quick-add-store";
import { cn } from "@/lib/utils";

export function TaskList() {
  const tasks = useUserDataStore((s) =>
    s.activeUserId
      ? (s.dataByUser[s.activeUserId] ?? EMPTY_USER_DATA).tasks
      : EMPTY_USER_DATA.tasks,
  );
  const openDialog = useQuickAddStore((s) => s.openDialog);
  const { toast } = useToast();

  const completed = tasks.filter((t) => t.done).length;

  const handleToggle = (id: string, wasDone: boolean) => {
    toggleTask(id);
    if (!wasDone) toast({ title: "Task completed", variant: "success" });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          Today's plan
        </CardTitle>
        {tasks.length > 0 ? (
          <Badge variant="secondary">
            {completed}/{tasks.length} done
          </Badge>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            aria-label="Add task"
            onClick={() => openDialog("task")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-1.5">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <ListTodo className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold">No tasks yet</p>
              <p className="text-xs text-muted-foreground">
                Plan your day — add your first task.
              </p>
            </div>
            <Button size="sm" variant="gradient" onClick={() => openDialog("task")}>
              <Plus className="h-4 w-4" />
              Add task
            </Button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.button
                key={task.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                type="button"
                onClick={() => handleToggle(task.id, task.done)}
                aria-pressed={task.done}
                className="focus-ring flex w-full items-center gap-3 rounded-2xl border border-transparent p-2.5 text-left transition-colors hover:border-border hover:bg-muted/50"
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium transition-colors",
                      task.done && "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                  </p>
                </div>
                {task.time && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {task.time}
                  </span>
                )}
                {task.tag && (
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {task.tag}
                  </Badge>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
