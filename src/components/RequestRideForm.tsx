// src/components/RequestRideForm.tsx
import React, { useState } from "react";
import { sendRideRequest } from "../services/api";

interface RideFormData {
  passengerId: string;
  pickupLocation: string;
  destination: string;
  provider: "sqs" | "rabbitmq" | "all";
}

interface RequestRideFormProps {
  onClose: () => void;
}

const RequestRideForm: React.FC<RequestRideFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<RideFormData>({
    passengerId: "",
    pickupLocation: "",
    destination: "",
    provider: "sqs",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await sendRideRequest(formData);
      setMessage("Solicitud enviada correctamente ✅");
    } catch (error) {
      console.error(error);
      setMessage("Error al enviar la solicitud ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título y botón de cerrar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request a Ride</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-2xl leading-none"
            aria-label="Close"
          >
            x
          </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Passenger ID</label>
          <input
            type="text"
            name="passengerId"
            value={formData.passengerId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Provider</label>
          <select
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
          >
            <option value="sqs">SQS</option>
            <option value="rabbitmq">RabbitMQ</option>
            <option value="all">All</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
      )}
      </div>
    </div>
  );
};

export default RequestRideForm;
