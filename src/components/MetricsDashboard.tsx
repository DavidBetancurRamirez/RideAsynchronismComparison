// src/components/MetricsDashboard.tsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getMetrics, metricSummaryInitialValue, type MetricSummary } from "../services/api";

const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricSummary>(metricSummaryInitialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener métricas");
    } finally {
      setLoading(false);
    }
  };

  // Datos transformados para gráficos
  const consumers = ["DriverMatcher", "FareCalculator"];
  const consumerData = consumers.map((c) => ({
    consumer: c,
    avg_latency: metrics.by_consumer[c]?.avg_latency ?? 0,
  }));

  const providers = ["sqs", "rabbitmq"];
  const providerData = providers.map((p) => ({
    provider: p,
    avg_latency: metrics.by_provider[p]?.avg_latency ?? 0,
  }));

  const comparisonData = metrics.comparison_by_messageId.length
    ? metrics.comparison_by_messageId.map((record) => {
        const newRecord: any = { messageId: record.messageId };
        Object.entries(record).forEach(([origin, consumers]) => {
          if (origin === "messageId") return;
          Object.entries(consumers as Record<string, number>).forEach(([consumer, latency]) => {
            newRecord[`${consumer}_${origin}`] = latency;
          });
        });
        return newRecord;
      })
    : [
        {
          messageId: "No data",
          DriverMatcher_sqs: 0,
          DriverMatcher_rabbitmq: 0,
          FareCalculator_sqs: 0,
          FareCalculator_rabbitmq: 0,
        },
      ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-4">
      {/* Header con botón actualizar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Metrics Dashboard</h2>
        <button
          onClick={fetchMetrics}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Actualizar métricas"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Loading */}
      {loading && (
        <div className="bg-white p-4 rounded-md shadow-md text-center font-medium">
          Cargando métricas...
        </div>
      )}

      {/* Resumen global */}
      {!loading && metrics.summary.total_messages === 0 && (
        <div className="bg-white p-4 rounded-md shadow-md text-center text-gray-500">
          Aun no hay métricas.
        </div>
      )}

      {!loading && (
        <>
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Total mensajes: {metrics.summary.total_messages}</p>
            <p>Latencia promedio: {metrics?.summary?.avg_latency_ms?.toFixed(2) ?? "0"} ms</p>
          </div>

          {/* Primer fila: dos gráficas lado a lado */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Latencia promedio por consumer */}
            <div className="bg-white p-4 rounded-md shadow-md flex-1">
              <h3 className="font-medium mb-2">Latencia promedio por consumer</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consumerData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="consumer" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_latency" name="Avg Latency (ms)" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Latencia promedio por provider */}
            <div className="bg-white p-4 rounded-md shadow-md flex-1">
              <h3 className="font-medium mb-2">Latencia promedio por provider</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={providerData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="provider" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avg_latency" name="Avg Latency (ms)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparación por messageId */}
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="font-medium mb-2">Comparación por messageId</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="messageId" />
                <YAxis />
                <Tooltip />
                <Legend />
                {comparisonData[0] &&
                  Object.keys(comparisonData[0])
                    .filter((key) => key !== "messageId")
                    .map((key, idx) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={key}
                        fill={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                      />
                    ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default MetricsDashboard;
