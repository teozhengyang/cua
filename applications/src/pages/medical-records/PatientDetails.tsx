import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPatients } from '../../utils/mockPatients';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const patient = mockPatients.find((p) => p.id === id);

  const [diagnosis, setDiagnosis] = useState('');
  const [records, setRecords] = useState(patient?.diagnoses ?? []);

  if (!patient) return <p className="p-6">Patient not found.</p>;

  const handleAdd = () => {
    if (diagnosis.trim()) {
      const updated = [...records, diagnosis];
      setRecords(updated);
      setDiagnosis('');
      alert('Diagnosis added!');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <Link to="/medical" className="btn btn-sm btn-ghost mb-4">← Back</Link>

      <h1 className="text-2xl font-bold mb-2">{patient.name}</h1>
      <p>ID: {patient.id}</p>
      <p>Age: {patient.age}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Medical Records</h2>
        {records.length === 0 ? (
          <p className="italic text-gray-500">No records yet.</p>
        ) : (
          <ul className="list-disc pl-6 text-sm mb-4">
            {records.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}

        <div className="form-control max-w-md">
         <label className="label">Add Diagnosis</label>
         <textarea
           className="textarea textarea-bordered h-24"
           value={diagnosis}
           onChange={(e) => setDiagnosis(e.target.value)}
           placeholder="e.g. Asthma, detailed notes..."
         />
         <button className="btn btn-primary mt-2" onClick={handleAdd}>
           Add
         </button>
       </div>
      </div>
    </div>
  );
};

export default PatientDetails;
