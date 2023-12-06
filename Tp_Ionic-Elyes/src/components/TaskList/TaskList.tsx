import React, { useEffect, useState, useRef } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonContent,
  IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { fromEvent, Subscription } from "rxjs";
import { buffer, debounceTime, filter } from "rxjs/operators";
import "./TaskList.css";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();
  const taskRefs = useRef(
    new Map<string, React.RefObject<HTMLIonLabelElement>>()
  );

  const fetchTasks = () => {
    ApiService.get<Task[]>("tasks").subscribe({
      next: (data) => {
        const sortedTasks = data.sort(
          (a, b) => Number(a.completed) - Number(b.completed)
        );
        setTasks(sortedTasks);
      },
      error: (err) =>
        console.error("Erreur lors de la récupération des tâches:", err),
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const subscriptions: Subscription[] = [];

    tasks.forEach((task) => {
      const ref =
        taskRefs.current.get(task.id) || React.createRef<HTMLIonLabelElement>();
      taskRefs.current.set(task.id, ref);

      if (ref.current) {
        const clicks = fromEvent(ref.current, "click");
        const doubleClicks = clicks.pipe(
          buffer(clicks.pipe(debounceTime(250))),
          filter((clickArray) => clickArray.length === 2)
        );

        const subscription = doubleClicks.subscribe(() => {
          toggleTaskCompletion(task);
        });

        subscriptions.push(subscription);
      }
    });

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [tasks]);

  const toggleTaskCompletion = (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    ApiService.put(`tasks/${task.id}`, updatedTask).subscribe({
      next: () => fetchTasks(),
      error: (err) =>
        console.error("Erreur lors de la mise à jour de la tâche:", err),
    });
  };

  const handleEdit = (taskId: string) => {
    history.push(`/edit-task/${taskId}`);
  };

  const handleDelete = (taskId: string) => {
    setSelectedTask(taskId);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      ApiService.delete(`tasks/${selectedTask}`).subscribe({
        next: () => fetchTasks(),
        error: (err) =>
          console.error("Erreur lors de la suppression de la tâche:", err),
      });
    }
    setShowDeleteAlert(false);
  };

  return (
    <IonContent>
      {tasks.length > 0 ? (
        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id}>
              <IonLabel ref={taskRefs.current.get(task.id)}>
                <span className={task.completed ? "task-completed" : ""}>
                  {task.title}
                </span>
              </IonLabel>
              <IonButton onClick={() => handleEdit(task.id)}>Edit</IonButton>
              <IonButton color="danger" onClick={() => handleDelete(task.id)}>
                Delete
              </IonButton>
              <IonButton onClick={() => toggleTaskCompletion(task)}>
                {task.completed ? "Invalider" : "Valider"}
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      ) : (
        <div>No tasks available</div>
      )}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Confirm Delete"
        message="Are you sure you want to delete this task?"
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => setShowDeleteAlert(false),
          },
          {
            text: "Okay",
            handler: () => confirmDelete(),
          },
        ]}
      />
    </IonContent>
  );
};

export default TaskList;