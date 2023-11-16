export default class JsonServer {
    static url = "https://localhost:8000/bornemap";
  
    static async loadBorne() {
      try {
        const response = await fetch(`${JsonServer.url}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const borne = await response.json();
        console.log(`getBorne function loadBorne`, borne);
        return borne;
      } catch (error) {
        console.error(`Erreur attrapée dans loadBorne :`, error);
        return null;
      }
    }
  }
  