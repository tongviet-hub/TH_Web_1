export interface Employee {
  id: number;
  name: string;
  maxCustomersPerDay: number;
  workingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  averageRating: number;
  totalReviews: number;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  employeeId: number;
  serviceId: number;
  date: string;
  start: string;
  end: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  estimatedCost?: number;
}

export interface Review {
  id: number;
  appointmentId: number;
  employeeId: number;
  rating: number;
  comment: string;
  createdAt: string;
  isServiceReview: boolean;
  employeeResponse?: string;
}

export interface RevenueReport {
  date: string;
  serviceId?: number;
  employeeId?: number;
  totalRevenue: number;
  appointmentCount: number;
}
