import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function formatETA(eta) {
  if (!eta) return "Calculating...";

  // Firestore Timestamp → JS Date
  if (eta._seconds) {
    const etaTime = new Date(eta._seconds * 1000);
    const now = new Date();

    const diffMs = etaTime - now;
    const diffMin = Math.max(0, Math.ceil(diffMs / 60000));

    return `${diffMin} min`;
  }

  // If backend later sends number/string
  return eta;
}

export default function QueueStatus({ queueId, onBack }) {
  const [status, setStatus] = useState(null);

  const loadStatus = async () => {
    const data = await apiFetch(`/api/queues/${queueId}/status`);
    setStatus(data);
  };

  useEffect(() => {
    loadStatus();
    const t = setInterval(loadStatus, 20000);
    return () => clearInterval(t);
  }, [queueId]);

  if (!status) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h2>Your Queue Status</h2>

      <div className="card">
        <p><strong>Current Serving:</strong> {status.currentServing}</p>
        <p><strong>Your Queue Number:</strong> {status.yourQueueNumber}</p>
        <p><strong>People Ahead:</strong> {status.peopleAhead}</p>
        <p><strong>ETA:</strong> {formatETA(status.eta)}</p>
      </div>

      <button onClick={onBack}>Back to Hospitals</button>
    </div>
  );
}
