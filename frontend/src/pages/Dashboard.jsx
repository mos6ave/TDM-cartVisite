import { useEffect, useState } from 'react';
import { getEmployees, getDepartments } from '../api';
import { Users, Building2, CreditCard, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [empCount, setEmpCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees().then(r => { setEmpCount(r.data.length); setRecent(r.data.slice(0, 4)); });
    getDepartments().then(r => setDeptCount(r.data.length));
  }, []);

  const stats = [
    { label: 'Total Employés', value: empCount, icon: Users, color: '#007A3D', bg: '#F0FDF4', link: '/employees' },
    { label: 'Départements', value: deptCount, icon: Building2, color: '#C8181E', bg: '#FEF2F2', link: '/departments' },
    { label: 'Cartes générables', value: empCount, icon: CreditCard, color: '#6B2737', bg: '#FDF2F4', link: '/employees' },
    { label: 'Actifs', value: empCount, icon: TrendingUp, color: '#D97706', bg: '#FFFBEB', link: '/employees' },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, #1E3A2F 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>Bienvenue dans le système</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Télédiffusion de Mauritanie
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>البث الإذاعي والتلفزي الموريتاني — TDM S.A</p>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {[['T','#C8181E'],['D','#007A3D'],['M','#F5C518']].map(([l,bg]) => (
            <span key={l} style={{ background: bg, color: bg==='#F5C518'?'#111':'#fff', fontWeight: 900, fontSize: 28, padding: '4px 10px', borderRadius: 6 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <div key={label} onClick={() => navigate(link)} className="hover-lift" style={{
            background: 'var(--white)', borderRadius: 14, padding: '20px',
            boxShadow: 'var(--shadow)', cursor: 'pointer',
            borderLeft: `3px solid ${color}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.02em' }}>{value}</div>
              </div>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent employees */}
      {recent.length > 0 && (
        <div style={{ background: 'var(--white)', borderRadius: 14, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Derniers employés</h3>
            <button onClick={() => navigate('/employees')} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Voir tout →</button>
          </div>
          {recent.map((emp, i) => (
            <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < recent.length-1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #007A3D, #005A2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{emp.first_name[0]}{emp.last_name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.first_name} {emp.last_name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>{emp.position}</div>
              </div>
              {emp.department_name && (
                <span style={{ background: '#F0FDF4', color: 'var(--green)', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99 }}>
                  {emp.department_name}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
