import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import QueueControl from "./QueueControl";

const ReceptionDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/doctors/reception")
      .then(setDoctors)
      .catch(err => setError(err.message));
  }, []);

  if (selectedDoctor) {
    return (
      <QueueControl
        doctor={selectedDoctor}
        onBack={() => setSelectedDoctor(null)}
      />
    );
  }

  return (
    <div style={styles.container}>
      <h2>Doctors</h2>

      {error && <p style={styles.error}>{error}</p>}

      {doctors.map(doc => (
        <div
          key={doc.id}
          style={styles.card}
          onClick={() => setSelectedDoctor(doc)}
        >
          <strong>{doc.name}</strong>
          <div>{doc.specialization}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { padding: 20 },
  card: {
    padding: 12,
    marginBottom: 10,
    border: "1px solid #444",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: { color: "red" },
};

export default ReceptionDashboard;
