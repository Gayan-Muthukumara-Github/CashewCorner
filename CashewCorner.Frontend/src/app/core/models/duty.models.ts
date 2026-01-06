export interface EmployeeDutyResponse {
  dutyId: number;
  employeeId: number;
  employeeName: string;
  taskType: string;
  salesOrderId: number | null;
  salesOrderNumber: string | null;
  purchaseOrderId: number | null;
  purchaseOrderNumber: string | null;
  startDate: string; // ISO 8601 format
  endDate: string | null;
  status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDutyRequest {
  taskType: string;
  salesOrderId?: number;
  purchaseOrderId?: number;
  startDate: string; // ISO 8601 format
  notes: string;
}

export interface UpdateDutyStatusRequest {
  status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
}

export interface AssignDutyRequest {
  taskType: string;
  salesOrderId?: number;
  purchaseOrderId?: number;
  startDate: string;
  notes: string;
}
