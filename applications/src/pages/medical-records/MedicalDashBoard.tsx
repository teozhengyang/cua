import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPatients } from '../../utils/mockPatients';

const MedicalDashboard = () => {
  const [search, setSearch] = useState('');

  const filtered = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-3xl font-bold mb-4">Medical Records Dashboard</h1>

      <div className="form-control mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search patient name..."
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 max-w-2xl">
        {filtered.map((p) => (
          <Link to={`/medical/${p.id}`} key={p.id}>
            <div className="card bg-base-100 shadow-md p-4 hover:bg-base-300 cursor-pointer">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p>ID: {p.id}</p>
              <p>Age: {p.age}</p>
              <p>Diagnoses: {p.diagnoses.length}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MedicalDashboard;
