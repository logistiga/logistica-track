// Configuration et client API pour l'intégration logistique externe
import type { ApiResponse, Client, OrdreTravail, Invoice, ApiStats } from "@/types/logistique.types";

const API_BASE_URL = "https://d16b9f7b-d97a-41e1-b5d0-a72f0873dc6d.lovable.app/api/external";

class LogistiqueApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[LogistiqueAPI] Erreur:", response.status, data);
        throw new Error(data.message || `Erreur API: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("[LogistiqueAPI] Erreur de requête:", error);
      throw error;
    }
  }

  // === HEALTH CHECK ===
  async checkHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request("/health");
  }

  async getStats(): Promise<ApiResponse<ApiStats>> {
    return this.request("/stats");
  }

  // === CLIENTS ===
  async getClients(params?: { search?: string; page?: number }): Promise<ApiResponse<Client[]>> {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : "";
    return this.request(`/clients${query ? `?${query}` : ""}`);
  }

  async getClient(id: number): Promise<ApiResponse<Client>> {
    return this.request(`/clients/${id}`);
  }

  async createClient(data: {
    nom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
  }): Promise<ApiResponse<Client>> {
    return this.request("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateClient(
    id: number,
    data: Partial<{
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
    }>
  ): Promise<ApiResponse<Client>> {
    return this.request(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // === ORDRES DE TRAVAIL ===
  async getOrdresTravail(params?: {
    status?: string;
    client_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
  }): Promise<ApiResponse<OrdreTravail[]>> {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : "";
    return this.request(`/ordres-travail${query ? `?${query}` : ""}`);
  }

  async getOrdreTravail(id: number): Promise<ApiResponse<OrdreTravail>> {
    return this.request(`/ordres-travail/${id}`);
  }

  async createOrdreTravail(data: {
    client_id: number;
    date: string;
    type: string;
    reference?: string;
    booking_number?: string;
    vessel_name?: string;
    containers?: Array<{ number: string; type: string }>;
    lignes_prestations?: Array<{
      description: string;
      quantite: number;
      prix_unitaire: number;
    }>;
  }): Promise<ApiResponse<OrdreTravail>> {
    return this.request("/ordres-travail", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateOrdreTravail(
    id: number,
    data: Partial<{
      date: string;
      type: string;
      reference: string;
      booking_number: string;
      vessel_name: string;
    }>
  ): Promise<ApiResponse<OrdreTravail>> {
    return this.request(`/ordres-travail/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateOrdreTravailStatus(
    id: number,
    status: string,
    notes?: string
  ): Promise<ApiResponse<OrdreTravail>> {
    return this.request(`/ordres-travail/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  }

  // === FACTURES ===
  async getInvoices(params?: {
    status?: string;
    client_id?: number;
    page?: number;
  }): Promise<ApiResponse<Invoice[]>> {
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : "";
    return this.request(`/invoices${query ? `?${query}` : ""}`);
  }

  async getInvoice(id: number): Promise<ApiResponse<Invoice>> {
    return this.request(`/invoices/${id}`);
  }
}

export const createLogistiqueApi = (apiKey: string) => new LogistiqueApiService(apiKey);

// Instance par défaut avec clé API depuis les variables d'environnement
export const logistiqueApi = createLogistiqueApi(
  import.meta.env.VITE_LOGISTIQUE_API_KEY || ""
);
