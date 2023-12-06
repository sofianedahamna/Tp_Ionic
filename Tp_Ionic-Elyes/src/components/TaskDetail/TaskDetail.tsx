// Importations nécessaires depuis React, Ionic et autres modules
import React, { useEffect, useState } from 'react';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import './TaskDetail.css';

// Définition de l'interface pour une tâche
interface Task {
  id: string;
  title: string;
  description?: string;
}

// Définition de l'interface pour les paramètres de route
interface RouteParams {
  id: string;
}

const TaskDetail: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null); // État pour stocker les détails de la tâche
  const { id } = useParams<RouteParams>(); // Récupération de l'ID de la tâche depuis l'URL
  const history = useHistory(); // Utilisé pour la navigation programmée

  // Charge les détails de la tâche lors du montage du composant
  useEffect(() => {
    const subscription = ApiService.get<Task>(`tasks/${id}`).subscribe({
      next: data => setTask(data), // Met à jour l'état avec les données de la tâche
      error: err => console.error('Erreur lors du chargement de la tâche:', err)
    });
    return () => subscription.unsubscribe(); // Nettoyage pour éviter les fuites de mémoire
  }, [id]);

  // Rendu du composant TaskDetail
  return (
    <IonContent>
      {/* Affiche les détails de la tâche si elle est trouvée */}
      {task ? (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{task.title}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {task.description}
          </IonCardContent>
        </IonCard>
      ) : (
        <div>Task not found or failed to load</div> // Message si la tâche n'est pas trouvée ou ne peut être chargée
      )}
      <IonButton expand="block" onClick={() => history.push('/tasks')}>Back to List</IonButton> // Bouton pour revenir à la liste des tâches
    </IonContent>
  );
};

export default TaskDetail;
