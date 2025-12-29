import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logistiqueApi } from "@/services/logistique-api.service";

// === HEALTH CHECK ===
export const useApiHealth = () => {
  return useQuery({
    queryKey: ["logistique", "health"],
    queryFn: () => logistiqueApi.checkHealth(),
    refetchInterval: 60000, // Vérifier toutes les minutes
    retry: 1,
  });
};

export const useApiStats = () => {
  return useQuery({
    queryKey: ["logistique", "stats"],
    queryFn: () => logistiqueApi.getStats(),
  });
};

// === CLIENTS ===
export const useClients = (params?: { search?: string; page?: number }) => {
  return useQuery({
    queryKey: ["logistique", "clients", params],
    queryFn: () => logistiqueApi.getClients(params),
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ["logistique", "client", id],
    queryFn: () => logistiqueApi.getClient(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      nom: string;
      email?: string;
      telephone?: string;
      adresse?: string;
    }) => logistiqueApi.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistique", "clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{ nom: string; email: string; telephone: string; adresse: string }>;
    }) => logistiqueApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistique", "clients"] });
    },
  });
};

// === ORDRES DE TRAVAIL ===
export const useOrdresTravail = (params?: {
  status?: string;
  client_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["logistique", "ordres-travail", params],
    queryFn: () => logistiqueApi.getOrdresTravail(params),
  });
};

export const useOrdreTravail = (id: number) => {
  return useQuery({
    queryKey: ["logistique", "ordre-travail", id],
    queryFn: () => logistiqueApi.getOrdreTravail(id),
    enabled: !!id,
  });
};

export const useCreateOrdreTravail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
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
    }) => logistiqueApi.createOrdreTravail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistique", "ordres-travail"] });
    },
  });
};

export const useUpdateOrdreTravail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{
        date: string;
        type: string;
        reference: string;
        booking_number: string;
        vessel_name: string;
      }>;
    }) => logistiqueApi.updateOrdreTravail(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistique", "ordres-travail"] });
    },
  });
};

export const useUpdateOrdreTravailStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: number;
      status: string;
      notes?: string;
    }) => logistiqueApi.updateOrdreTravailStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistique", "ordres-travail"] });
    },
  });
};

// === FACTURES ===
export const useInvoices = (params?: {
  status?: string;
  client_id?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["logistique", "invoices", params],
    queryFn: () => logistiqueApi.getInvoices(params),
  });
};

export const useInvoice = (id: number) => {
  return useQuery({
    queryKey: ["logistique", "invoice", id],
    queryFn: () => logistiqueApi.getInvoice(id),
    enabled: !!id,
  });
};
