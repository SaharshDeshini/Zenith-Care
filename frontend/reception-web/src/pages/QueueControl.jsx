import { useState } from "react";
import { apiFetch } from "../api";

const QueueControl = ({ doctor, onBack }) => {
  const [queueId, setQueueId] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState("");
  const [delayMinutes, setDelayMinutes] = useState("");
  const [currentDelay, setCurrentDelay] = useState(0);


  const initQueue = async () => {
    try {
      const res = await apiFetch("/api/queues/init", {
        method: "POST",
        body: JSON.stringify({ doctorId: doctor.id }),
      });
      setQueueId(res.queueId);
      setMessage("Queue initialized");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const addPatient = async () => {
    if (!patientName || !queueId) return;

    try {
      await apiFetch("/api/queues/join", {
        method: "POST",
        body: JSON.stringify({
          queueId,
          patientName,
        }),
      });
      setPatientName("");
      setMessage("Patient added");
    } catch (e) {
      setMessage(e.message);
    }
  };

  const sendNext = async () => {
    await apiFetch(`/api/phase3/send-next/${queueId}`, {
      method: "POST",
    });
    setMessage("Next patient sent");
  };

  const pauseQueue = async () => {
    await apiFetch(`/api/phase4/pause/${queueId}`, {
      method: "POST",
    });
    setMessage("Queue paused");
  };

  const resumeQueue = async () => {
    await apiFetch(`/api/phase4/resume/${queueId}`, {
      method: "POST",
    });
    setMessage("Queue resumed");
  };

  const endDay = async () => {
    await apiFetch("/api/phase3/end-day", {
      method: "POST",
      body: JSON.stringify({ queueId }),
    });
    setQueueId(null);
    setMessage("OPD closed");
  };

  const updateDelay = async (minutes) => {
  try {
    await apiFetch("/api/phase3/delay", {
      method: "POST",
      body: JSON.stringify({
        queueId,
        minutes,
      }),
    });

    setCurrentDelay(minutes);
    setDelayMinutes("");
    setMessage(
      minutes === 0
        ? "Delay removed"
        : `Delay updated to ${minutes} minutes`
    );
  } catch (e) {
    setMessage(e.message);
  }
};


  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>← Back</button>

      <h2>{doctor.name}</h2>

      {!queueId && (
        <button onClick={initQueue}>Start OPD / Init Queue</button>
      )}

      {queueId && (
        <>
          <h3>Add Walk-in Patient</h3>
          <input
            placeholder="Patient name"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
          />
          <button onClick={addPatient}>Add</button>

          <hr />

          <button onClick={sendNext}>Send Next</button>
          <hr />

      <h3>Delay Control</h3>

      <p>Current delay: {currentDelay} minutes</p>

      <input
        type="number"
        placeholder="Delay in minutes"
        value={delayMinutes}
        onChange={(e) => setDelayMinutes(e.target.value)}
      />

      <button onClick={() => updateDelay(Number(delayMinutes))}>
        Add / Update Delay
      </button>

      <button onClick={() => updateDelay(0)}>
        Remove Delay
      </button>
                <button onClick={pauseQueue}>Pause</button>
                <button onClick={resumeQueue}>Resume</button>
                <button onClick={endDay}>End Day</button>
              </>
            )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default QueueControl;
