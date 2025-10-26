// src/services/api.ts
import axios from "axios";

const API_GATEWAY_BASE_URL = import.meta.env.VITE_API_URL;
const REQUEST_RIDE_URL = `${API_GATEWAY_BASE_URL}/request-ride`;
const GET_METRICS_URL = `${API_GATEWAY_BASE_URL}/get-metrics`;

export interface RideFormData {
  passengerId: string;
  pickupLocation: string;
  destination: string;
  provider: "sqs" | "rabbitmq" | "all";
}

// Función para enviar request-ride
export const sendRideRequest = async (data: RideFormData) => {
  const response = await axios.post(REQUEST_RIDE_URL, data);
  return response.data;
};

export interface MetricSummary {
  summary: { total_messages: number; avg_latency_ms: number };
  by_consumer: Record<
    string,
    { count: number; avg_latency: number; min_latency: number; max_latency: number; std_latency: number }
  >;
  by_provider: Record<string, { count: number; avg_latency: number }>;
  comparison_by_messageId: Array<any>;
}

export const metricSummaryInitialValue: MetricSummary = {
  summary: { total_messages: 0, avg_latency_ms: 0 },
  by_consumer: {},
  by_provider: {},
  comparison_by_messageId: [],
};

// Función para obtener métricas
export const getMetrics = async () => {
  const response = await axios.get(GET_METRICS_URL);
  return response.data ?? metricSummaryInitialValue;
};
