// src/App.tsx
import React, { useState } from "react";
import MetricsDashboard from "./components/MetricsDashboard";
import RequestRideForm from "./components/RequestRideForm";

const App: React.FC = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const toggleRequestForm = () => setShowRequestForm((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header mejorado */}
      <header className="flex justify-between items-center bg-linear-to-r from-blue-600 to-blue-500 text-white p-6 shadow-md mb-6 rounded-b-lg">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-md">
          Go-EIA Ride Metrics
        </h1>
        <button
          onClick={toggleRequestForm}
          className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          {showRequestForm ? "Cerrar formulario" : "Solicitar viaje"}
        </button>
      </header>

      {/* Metrics Dashboard siempre visible */}
      <div className="px-6">
        <MetricsDashboard />
      </div>

      {/* RequestRideForm como popup */}
      {showRequestForm && <RequestRideForm onClose={toggleRequestForm} />}
    </div>
  );
};

export default App;
