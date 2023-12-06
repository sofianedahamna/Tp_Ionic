// Importations nécessaires depuis React, Ionic et autres modules
import React, { useState, useEffect } from "react";
import {
  IonInput,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./TaskForm.css";

// Définition de l'interface pour une tâche
interface Task {
  id: string;
  title: string;
  description?: string;
}

// Définition de l'interface pour les paramètres de route
interface RouteParams {
  id?: string;
}

const TaskForm: React.FC = () => {
  // État pour stocker les détails de la tâche en cours de modification ou de création
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
  });
  const { id } = useParams<RouteParams>(); // Récupération de l'ID de la tâche depuis l'URL
  const isEditing = id !== undefined; // Détermine si le formulaire est en mode édition
  const history = useHistory(); // Utilisé pour la navigation programmée

  // Chargement des détails de la tâche pour l'édition
  useEffect(() => {
    if (isEditing && id) {
      const subscription = ApiService.get<Task>(`tasks/${id}`).subscribe({
        next: (data) => setTask(data), // Met à jour l'état avec les données de la tâche
        error: (err) => console.error("Erreur lors du chargement de la tâche:", err),
      });
      return () => subscription.unsubscribe(); // Nettoyage pour éviter les fuites de mémoire
    }
  }, [id, isEditing]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) {
      alert("Please enter a task title"); // Vérification simple pour s'assurer qu'un titre est fourni
      return;
    }

    // Ajoutez la propriété 'completed' pour les nouvelles tâches
    const taskToSave = isEditing ? task : { ...task, completed: false };

    // Détermine si la tâche doit être créée ou mise à jour
    const operation = isEditing ? ApiService.put : ApiService.post;
    operation<Task>(`tasks/${isEditing ? id : ""}`, taskToSave).subscribe({
      next: () => history.push("/tasks"), // Redirige vers la liste des tâches après l'enregistrement
      error: (err) => console.error("Erreur lors de l’enregistrement de la tâche:", err),
    });
  };

  // Gestion du changement des champs de formulaire
  const handleInputChange = (e: CustomEvent, field: keyof Task) => {
    setTask({ ...task, [field]: e.detail.value! }); // Met à jour l'état avec les nouvelles valeurs
  };

  // Rendu du formulaire
  return (
    <IonContent>
      <form onSubmit={handleSubmit} className="task-form">
        <IonItem>
          <IonLabel position="floating">Task Title</IonLabel>
          <IonInput
            value={task.title}
            onIonChange={(e) => handleInputChange(e, "title")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonInput
            value={task.description}
            onIonChange={(e) => handleInputChange(e, "description")}
          />
        </IonItem>
        <IonButton expand="block" type="submit">
          Save Task
        </IonButton>
        <IonButton
          expand="block"
          color="light"
          onClick={() => history.push("/tasks")}
        >
          Cancel
        </IonButton>
      </form>
    </IonContent>
  );
};

export default TaskForm;
