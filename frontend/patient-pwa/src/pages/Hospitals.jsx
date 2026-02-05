import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Hospitals({ onSelect }) {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    apiFetch("/api/hospitals").then(setHospitals);
  }, []);

  return (
    <div className="page">
      <h2>Select Hospital</h2>

      {hospitals.map((h) => (
        <div key={h.id} className="card">
          <strong>{h.name}</strong>
          <p>{h.location}</p>
          <button onClick={() => onSelect(h)}>View Doctors</button>
        </div>
      ))}
    </div>
  );
}
