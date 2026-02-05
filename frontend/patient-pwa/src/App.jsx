import { useState } from "react";
import Hospitals from "./pages/Hospitals";
import Doctors from "./pages/Doctors";
import QueueStatus from "./pages/QueueStatus";

function App() {
  const [page, setPage] = useState("hospitals");
  const [hospital, setHospital] = useState(null);
  const [queueId, setQueueId] = useState(null);

  if (page === "hospitals") {
    return (
      <Hospitals
        onSelect={(h) => {
          setHospital(h);
          setPage("doctors");
        }}
      />
    );
  }

  if (page === "doctors") {
    return (
      <Doctors
        hospital={hospital}
        onJoined={(qid) => {
          setQueueId(qid);
          setPage("status");
        }}
        onBack={() => setPage("hospitals")}
      />
    );
  }

  if (page === "status") {
    return (
      <QueueStatus
        queueId={queueId}
        onBack={() => setPage("hospitals")}
      />
    );
  }

  return null;
}

export default App;
