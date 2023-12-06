import { from, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

// Constante globale pour l'URL de base
const BASE_URL = 'http://localhost:3000';

class ApiService {
  // Envoi d'une requête GET
  static get<T>(endpoint: string): Observable<T> {
    return from(fetch(`${BASE_URL}/${endpoint}`)).pipe(
      mergeMap(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json() as Promise<T>;
      }),
      catchError(error => {
        console.error('Erreur lors de la requête GET:', error);
        throw error;
      })
    );
  }

  // Envoi d'une requête POST
  static post<T>(endpoint: string, data: any): Observable<T> {
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })).pipe(
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

  // Envoi d'une requête PUT
  static put<T>(endpoint: string, data: any): Observable<T> {
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })).pipe(
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

  // Envoi d'une requête DELETE
  static delete<T>(endpoint: string): Observable<T> {
    return from(fetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE'
    })).pipe(
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

export default ApiService;