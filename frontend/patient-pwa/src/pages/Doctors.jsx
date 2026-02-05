import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Doctors({ hospital, onJoined, onBack }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    apiFetch(`/api/doctors?hospitalId=${hospital.id}`)
      .then(setDoctors);
  }, [hospital]);

  const joinQueue = async (doctorId) => {
    // 1. Get today's queue
    const queue = await apiFetch(
      `/api/queues/today?doctorId=${doctorId}`
    );

    // 2. Join queue
    const res = await apiFetch("/api/queues/join", {
      method: "POST",
      body: JSON.stringify({
        queueId: queue.queueId,
        patientName: "Self",
      }),
    });

    // 3. Go to status page
    onJoined(res.queueId);
  };

  return (
    <div className="page">
      <button onClick={onBack}>← Back</button>
      <h2>{hospital.name}</h2>

      {doctors.map((d) => (
        <div key={d.id} className="card">
          <strong>{d.name}</strong>
          <p>{d.specialization}</p>
          <button onClick={() => joinQueue(d.id)}>
            Join Queue
          </button>
        </div>
      ))}
    </div>
  );
}
