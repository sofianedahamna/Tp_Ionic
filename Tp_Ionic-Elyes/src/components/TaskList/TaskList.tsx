// Importations nécessaires pour React, Ionic et RxJS
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
import { Share } from '@capacitor/share';

// Définition de l'interface pour une tâche
interface Task {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
}

const TaskList: React.FC = () => {
  // État pour stocker les tâches, la tâche sélectionnée et l'affichage de l'alerte
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();

  // Références pour accéder aux éléments DOM des tâches
  const taskRefs = useRef(new Map<string, React.RefObject<HTMLIonLabelElement>>());

  // Récupère et trie les tâches depuis le backend
  const fetchTasks = () => {
    ApiService.get<Task[]>("tasks").subscribe({
      next: (data) => {
        const sortedTasks = [...data].sort((a, b) => Number(a.completed) - Number(b.completed));
        setTasks(sortedTasks);
      },
      error: (err) => console.error("Erreur lors de la récupération des tâches:", err),
    });
  };

  // Utilise useEffect pour charger les tâches au démarrage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  // Utilise useEffect pour gérer la détection des doubles clics sur les tâches
  useEffect(() => {
    const subscriptions: Subscription[] = [];

    tasks.forEach((task) => {
      const ref = taskRefs.current.get(task.id) || React.createRef<HTMLIonLabelElement>();
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

    // Désabonne les souscriptions lors du démontage du composant
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [tasks]);

  // Partage une tâche en utilisant Capacitor Share
  const shareTask = async (task: Task) => {
    try {
      await Share.share({
        title: 'Partager la Tâche',
        text: `Tâche : ${task.title}\nDescription : ${task.description || ''}`,
        url: 'http://localhost:8100/tasks/' + task.id,
        dialogTitle: 'Partager cette tâche avec',
      });
    } catch (error) {
      console.error('Erreur lors du partage de la tâche:', error);
    }
  };

  // Bascule le statut de complétion d'une tâche
  const toggleTaskCompletion = (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    ApiService.put(`tasks/${task.id}`, updatedTask).subscribe({
      next: () => fetchTasks(),
      error: (err) => console.error("Erreur lors de la mise à jour de la tâche:", err),
    });
  };

  // Redirige vers la page d'édition de la tâche
  const handleEdit = (taskId: string) => {
    history.push(`/edit-task/${taskId}`);
  };

  // Sélectionne une tâche pour suppression et affiche une alerte de confirmation
  const handleDelete = (taskId: string) => {
    setSelectedTask(taskId);
    setShowDeleteAlert(true);
  };

  // Confirme la suppression d'une tâche
  const confirmDelete = () => {
    if (selectedTask) {
      ApiService.delete(`tasks/${selectedTask}`).subscribe({
        next: () => fetchTasks(),
        error: (err) => console.error("Erreur lors de la suppression de la tâche:", err),
      });
    }
    setShowDeleteAlert(false);
  };

  // Rendu du composant TaskList
  return (
    <IonContent>
      {/* Affiche la liste des tâches si elles existent */}
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
              <IonButton onClick={() => shareTask(task)}>Partager</IonButton>
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
