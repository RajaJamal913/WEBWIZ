"use client";
import { useState, useEffect } from "react";
import FilterMultiSelects from '@/components/FilterMultiSelects';

interface ReportItem {
  project_id: number;
  project_name: string;
  total_seconds: number;
}

export default function TimeRequestTabs() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/reports/tracked-hours/', {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load report');
        return res.json();
      })
      .then((data: ReportItem[]) => setReports(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatHours = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-start mb-4">
        <FilterMultiSelects />
      </div>

      <div className="table-responsive g-table-wrap g-t-scroll">
        <h1 className="table-heading">Tracked Hours Report</h1>
        <table className="w-full table g-table">
          <thead>
            <tr className="text-white" style={{ backgroundColor: '#A54EF5' }}>
              <th>Project</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, idx) => (
              <tr key={idx} style={{ backgroundColor: '#F7ECFF' }}>
                <td className="px-4 py-3">{r.project_name}</td>
                <td className="px-4 py-3">{formatHours(r.total_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
