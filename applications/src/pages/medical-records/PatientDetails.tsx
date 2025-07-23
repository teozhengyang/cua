import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import { mockPatients } from '../../utils/mockPatients';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const patient = mockPatients.find((p) => p.id === id);

  const [diagnosis, setDiagnosis] = useState('');
  const [records, setRecords] = useState(patient?.diagnoses ?? []);

  if (!patient) return <p className="p-6 text-lg">Patient not found.</p>;

  const handleAdd = () => {
    if (diagnosis.trim()) {
      const updated = [...records, diagnosis];
      setRecords(updated);
      setDiagnosis('');
      toast.success('Diagnosis added successfully!', {
        duration: 4000, 
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-base-200 text-base-content">
      <Link to="/medical" className="btn btn-sm btn-ghost mb-6 text-lg">← Back</Link>

      <div className="bg-base-100 rounded-xl p-6 shadow-md max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
        <p className="text-lg">ID: <span className="font-medium">{patient.id}</span></p>
        <p className="text-lg mb-6">Age: <span className="font-medium">{patient.age}</span></p>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Medical Records</h2>
          {records.length === 0 ? (
            <p className="italic text-gray-500 text-base">No records yet.</p>
          ) : (
            <ul className="list-disc pl-6 text-base mb-6 space-y-1">
              {records.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}

          <div className="form-control max-w-2xl">
            <div className="flex flex-col gap-3">
              <label className="label block text-lg font-semibold mb-0">Add Diagnosis</label>
              <textarea
                className="textarea textarea-bordered text-base h-40"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Asthma with wheezing and shortness of breath..."
              />
              <button className="btn btn-primary text-base" onClick={handleAdd}>
                Add Diagnosis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
