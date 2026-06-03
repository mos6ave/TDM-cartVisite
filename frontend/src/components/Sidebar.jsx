import { Users, Building2, LayoutDashboard, Radio } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/employees', icon: Users, label: 'Employés' },
    { to: '/departments', icon: Building2, label: 'Départements' },
  ];
  return (
    <aside style={{
      width: 230, background: 'var(--dark)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[['T','#C8181E'],['D','#007A3D'],['M','#F5C518']].map(([l,bg]) => (
              <span key={l} style={{
                background: bg, color: bg === '#F5C518' ? '#111' : '#fff',
                fontWeight: 900, fontSize: 16, padding: '2px 5px', borderRadius: 4,
                lineHeight: 1.4,
              }}>{l}</span>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>Télédiffusion</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>de Mauritanie S.A</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 8px 10px' }}>
          Menu Principal
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'var(--green)' : 'transparent',
              textDecoration: 'none', fontSize: 13.5, fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
            })}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.07)',
        color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
        © 2024 TDM S.A
      </div>
    </aside>
  );
}
