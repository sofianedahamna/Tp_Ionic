// Importations nécessaires depuis React et Ionic
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { addCircleOutline, informationCircleOutline, list } from "ionicons/icons";

// Importation des styles CSS d'Ionic et du thème
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";
import "./App.css";

// Importation des composants pour les différentes pages de l'application
import TaskDetail from "./components/TaskDetail/TaskDetail";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";

// Configuration initiale d'Ionic
setupIonicReact();

// Définition du composant principal 'App'
const App: React.FC = () => (
  // Création de l'application avec IonApp (c'est le conteneur principal)
  <IonApp>
    <IonReactRouter>
      {/* Définition du menu latéral */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* Liste des options du menu */}
          <IonList>
            <IonMenuToggle auto-hide="false">
              {/* Option pour voir les tâches */}
              <IonItem
                button
                routerLink="/tasks"
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon slot="start" icon={list} />
                View Tasks
              </IonItem>
              {/* Option pour ajouter une tâche */}
              <IonItem
                button
                routerLink="/new-task"
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon slot="start" icon={addCircleOutline} />
                Add Task
              </IonItem>
              {/* Option pour la page 'À propos' */}
              <IonItem
                button
                routerLink="/about"
                routerDirection="none"
                lines="none"
                detail={false}
              >
                <IonIcon slot="start" icon={informationCircleOutline} />
                About
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Contenu principal de l'application */}
      <div id="main-content">
        {/* En-tête de l'application */}
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Your Task Manager</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Contenu de la page actuelle */}
        <IonContent>
          <IonRouterOutlet>
            {/* Routes pour naviguer entre les différentes pages */}
            <Route path="/tasks" component={TaskList} exact />
            <Route path="/new-task" component={TaskForm} exact />
            <Route path="/edit-task/:id" component={TaskForm} exact />
            <Route path="/tasks/:id" component={TaskDetail} exact />
            <Redirect from="/" to="/tasks" exact />
          </IonRouterOutlet>
        </IonContent>

        {/* Pied de page de l'application */}
        <IonFooter>
          <IonToolbar>
            <IonTitle>Footer Content</IonTitle>
          </IonToolbar>
        </IonFooter>
      </div>
    </IonReactRouter>
  </IonApp>
);

export default App;
