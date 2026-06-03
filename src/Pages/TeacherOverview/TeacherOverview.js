import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../Components/Layout';
import { api } from '../../Services/api';
import './TeacherOverview.css';

const displayName = (t) => {
  const full = [t?.firstName, t?.lastName].filter(Boolean).join(' ').trim();
  return (t?.name ?? full) || t?.userName || 'Teacher';
};

const teacherIdOf = (t) => {
  const raw = t?.id ?? t?.teacherId ?? t?.Id ?? t?.TeacherId ?? null;
  const n = typeof raw === 'string' ? parseInt(raw, 10) : raw;
  return Number.isFinite(n) ? n : null;
};

export default function TeacherOverview() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [desc, setDesc] = useState(false);

  const [selected, setSelected] = useState(null);
  const [studLoading, setStudLoading] = useState(false);
  const [studError, setStudError] = useState('');
  const [students, setStudents] = useState([]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/teacher', { timeout: 15000 });
      setTeachers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Could not load teachers. Check the API route /api/teachers and that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const teacherRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    let rows = term
      ? teachers.filter((t) =>
          [displayName(t), t?.email, t?.userName]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term))
        )
      : [...teachers];

    rows.sort((a, b) => {
      if (sortBy === 'name') {
        const av = displayName(a).toLowerCase();
        const bv = displayName(b).toLowerCase();
        if (av < bv) return desc ? 1 : -1;
        if (av > bv) return desc ? -1 : 1;
        return 0;
      }
      const av = Number(a?.studentCount || 0);
      const bv = Number(b?.studentCount || 0);
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });

    return rows;
  }, [teachers, q, sortBy, desc]);

  const totals = useMemo(
    () => ({
      teachers: teacherRows.length,
      students: teacherRows.reduce((s, t) => s + Number(t?.studentCount || 0), 0),
    }),
    [teacherRows]
  );

  const loadStudentsFor = async (teacher) => {
    const id = teacherIdOf(teacher);
    if (!id) {
      setStudError('Selected teacher has no id (expected id/teacherId).');
      setStudents([]);
      return;
    }
    try {
      setStudLoading(true);
      setStudError('');
      const { data } = await api.get(`/teacher/${id}/students`, { timeout: 15000 });
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Students load failed:', e?.response?.status, e?.message);
      setStudError('Could not load students for this teacher.');
      setStudents([]);
    } finally {
      setStudLoading(false);
    }
  };

  const onSelectTeacher = (t) => {
    setSelected(t);
    loadStudentsFor(t);
  };

  return (
    <Layout>
      <div className="tov2-container">
        <div className="tov2-header">
          <h2 className="tov2-title">Teacher Overview</h2>

          <div className="tov2-toolbar">
            <input
              className="tov2-search"
              placeholder="Search teachers…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="tov2-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort: Name</option>
              <option value="students">Sort: Students</option>
            </select>
            <button className="btn" onClick={() => setDesc((d) => !d)}>
              {desc ? '▼ Desc' : '▲ Asc'}
            </button>
            <button className="btn" onClick={fetchTeachers} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="tov2-panels">
          <div className="card tov2-card">
            <div className="card-header">
              <div>
                <div className="card-title">Teachers</div>
                <div className="card-subtitle">
                  {totals.teachers} teacher{totals.teachers !== 1 ? 's' : ''} · {totals.students} students total
                </div>
              </div>
            </div>

            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div className="loading">Loading teachers…</div>
              ) : error ? (
                <div className="alert" style={{ margin: 16 }}>{error}</div>
              ) : teacherRows.length === 0 ? (
                <div className="empty">No teachers to display.</div>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email / Username</th>
                        <th style={{ width: 90 }}>Students</th>
                        <th style={{ width: 100 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherRows.map((t) => (
                        <tr
                          key={t.id ?? displayName(t)}
                          className={selected?.id === t.id ? 'tov2-row-selected' : ''}
                        >
                          <td>{displayName(t)}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{t?.email || t?.userName || '—'}</td>
                          <td>
                            <span className="tov2-count-badge">{Number(t?.studentCount || 0)}</span>
                          </td>
                          <td>
                            <button className="btn" onClick={() => onSelectTeacher(t)}>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="card tov2-card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  {selected ? (
                    <>Students — <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{displayName(selected)}</span></>
                  ) : (
                    'Students'
                  )}
                </div>
                {!selected && <div className="card-subtitle">Select a teacher to view their students</div>}
              </div>
              {selected && (
                <button className="btn" onClick={() => loadStudentsFor(selected)} disabled={studLoading}>
                  {studLoading ? 'Loading…' : 'Refresh'}
                </button>
              )}
            </div>

            <div className="card-body" style={{ padding: 0 }}>
              {!selected ? (
                <div className="empty">Click "View" on a teacher to see their students.</div>
              ) : studLoading ? (
                <div className="loading">Loading students…</div>
              ) : studError ? (
                <div className="alert" style={{ margin: 16 }}>{studError}</div>
              ) : students.length === 0 ? (
                <div className="empty">No students for this teacher.</div>
              ) : (
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => (
                        <tr key={s.id ?? i}>
                          <td>{s.firstName}</td>
                          <td>{s.lastName}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
