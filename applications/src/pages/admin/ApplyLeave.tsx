import React, { useState } from 'react';

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const leaveApplication = {
      leaveType,
      startDate,
      endDate,
      reason,
    };

    console.log('Leave Application:', leaveApplication);
    alert('Leave application submitted!');
    
    // Reset form
    setLeaveType('Annual');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Leave Type */}
        <div className="form-control">
          <label className="label font-medium">Leave Type</label>
          <select
            className="select select-bordered"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="Annual">Annual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Unpaid">Unpaid Leave</option>
            <option value="Compassionate">Compassionate Leave</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="form-control">
          <label className="label font-medium">Start Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* End Date */}
        <div className="form-control">
          <label className="label font-medium">End Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Reason */}
        <div className="form-control">
          <label className="label font-medium">Reason</label>
          <textarea
            className="textarea textarea-bordered"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional details"
            rows={4}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Submit Application
        </button>
      </form>
    </>
  );
};

export default ApplyLeave;
