// Importation des modules nécessaires depuis rxjs
import { from, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

// Constante globale définissant l'URL de base de l'API
const BASE_URL = 'http://localhost:3000';

// Définition de la classe ApiService
class ApiService {

  // Fonction pour envoyer une requête GET
  static get<T>(endpoint: string): Observable<T> {
    // Utilise 'fetch' pour récupérer des données depuis l'endpoint spécifié
    return from(fetch(`${BASE_URL}/${endpoint}`)).pipe(
      // Utilise mergeMap pour traiter la réponse
      mergeMap(response => {
        // Vérifie si la réponse est OK, sinon lance une erreur
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        // Convertit la réponse en JSON
        return response.json() as Promise<T>;
      }),
      // Gère les erreurs et les affiche sur la console
      catchError(error => {
        console.error('Erreur lors de la requête GET:', error);
        throw error;
      })
    );
  }

  // Fonction pour envoyer une requête POST
  static post<T>(endpoint: string, data: any): Observable<T> {
    // Utilise 'fetch' pour poster des données vers l'endpoint spécifié
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })).pipe(
      // Traitement identique à la fonction get
      mergeMap(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json() as Promise<T>;
      }),
      catchError(error => {
        console.error('Erreur lors de la requête POST:', error);
        throw error;
      })
    );
  }

  // Fonction pour envoyer une requête PUT
  static put<T>(endpoint: string, data: any): Observable<T> {
    // Utilise 'fetch' pour mettre à jour des données à l'endpoint spécifié
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })).pipe(
      // Traitement identique aux fonctions get et post
      mergeMap(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json() as Promise<T>;
      }),
      catchError(error => {
        console.error('Erreur lors de la requête PUT:', error);
        throw error;
      })
    );
  }

  // Fonction pour envoyer une requête DELETE
  static delete<T>(endpoint: string): Observable<T> {
    // Utilise 'fetch' pour supprimer des données de l'endpoint spécifié
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE'
    })).pipe(
      // Traitement identique aux autres fonctions
      mergeMap(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json() as Promise<T>;
      }),
      catchError(error => {
        console.error('Erreur lors de la requête DELETE:', error);
        throw error;
      })
    );
  }
}

// Exportation de la classe ApiService pour être utilisée ailleurs dans l'application
export default ApiService;
