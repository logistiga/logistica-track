import { apiService } from './apiService';
import type { Operation, CreateOperationData } from '@/types/operations';

class OperationService {
  async getOperations(): Promise<Operation[]> {
    const response = await apiService.get('/operations');
    return response.data;
  }

  async createOperation(data: CreateOperationData): Promise<Operation> {
    const response = await apiService.post('/operations', data);
    return response.data;
  }

  async updateOperation(id: string, data: Partial<CreateOperationData>): Promise<Operation> {
    const response = await apiService.put(`/operations/${id}`, data);
    return response.data;
  }

  async deleteOperation(id: string): Promise<void> {
    await apiService.delete(`/operations/${id}`);
  }

  async updateStatut(id: string, statut: Operation['statut']): Promise<Operation> {
    const response = await apiService.put(`/operations/${id}/statut`, { statut });
    return response.data;
  }
}

export const operationService = new OperationService();