import { X, Download } from 'lucide-react';
import { getBusinessCardUrl } from '../api';

export default function BusinessCardPreview({ employee, onClose }) {
  const cardUrl = getBusinessCardUrl(employee.id);

  const CardFace = ({ lang }) => {
    const isAr = lang === 'ar';
    const name = isAr && employee.first_name_ar
      ? `${employee.first_name_ar} ${employee.last_name_ar}`
      : `${employee.first_name.toUpperCase()} ${employee.last_name.toUpperCase()}`;
    const pos = isAr && employee.position_ar ? employee.position_ar : employee.position.toUpperCase();

    return (
      <div style={{
        width: 324, height: 216, background: '#fff', borderRadius: 10, overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)', position: 'relative', fontFamily: 'Arial, sans-serif',
        border: '0.5px solid #ddd',
      }}>
        {/* Top tricolor bar */}
        <div style={{ display: 'flex', height: 10, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
          <div style={{ flex: 1, background: '#C8181E' }} />
          <div style={{ flex: 1, background: '#007A3D' }} />
          <div style={{ flex: 1, background: '#F5C518' }} />
        </div>

        {/* Green block — right for FR, left for AR */}
        <div style={{
          position: 'absolute', top: 10,
          [isAr ? 'left' : 'right']: 0,
          width: 100, height: 94,
          background: '#C8E6C9',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          {/* TDM Logo */}
          <div style={{ display: 'flex', gap: 2 }}>
            {[['T','#C8181E'],['D','#007A3D'],['M','#F5C518']].map(([l, bg]) => (
              <span key={l} style={{ background: bg, color: bg === '#F5C518' ? '#111' : '#fff', fontWeight: 900, fontSize: 13, padding: '2px 5px', borderRadius: 2 }}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 7, fontWeight: 700, color: '#111', textAlign: 'center', lineHeight: 1.5, marginTop: 4 }}>
            {isAr ? <>البث الاذاعي<br />والتلفزي الموريتاني</> : <>TELEDIFFUSION<br />DE MAURITANIE</>}
          </div>
          <div style={{ fontSize: 7.5, fontWeight: 800, color: '#007A3D' }}>TDM S.A</div>
        </div>

        {/* Vertical separator */}
        <div style={{
          position: 'absolute', top: 10,
          [isAr ? 'left' : 'right']: 104,
          width: 1, height: 94, background: '#007A3D',
        }} />

        {/* Text zone */}
        <div style={{
          position: 'absolute', top: 20,
          [isAr ? 'right' : 'left']: 18,
          maxWidth: 200,
          direction: isAr ? 'rtl' : 'ltr',
          textAlign: isAr ? 'right' : 'left',
        }}>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: '#111', letterSpacing: 0.3 }}>{name}</div>
          <div style={{ fontWeight: 700, fontSize: 8, color: '#007A3D', marginTop: 5, lineHeight: 1.5, maxWidth: 190 }}>{pos}</div>
          <div style={{ width: '90%', height: 1, background: '#C8E6C9', margin: '8px 0' }} />
          <div style={{ fontSize: 7.5, color: '#555', lineHeight: 2 }}>
            {employee.address && <div>{isAr ? '' : ''} {employee.address}</div>}
            {employee.phone && <div>{isAr ? 'ت:' : 'T:'} {employee.phone}</div>}
            {employee.fax && <div>{isAr ? 'ف:' : 'F:'} {employee.fax}</div>}
            {employee.email && <div>@ {employee.email}</div>}
          </div>
        </div>

        {/* Bottom green bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 9, background: '#007A3D' }} />
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--dark)', borderRadius: 20, padding: 32, maxWidth: 520, width: '100%', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>🪪 Carte de visite — 90×60mm</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}><X size={18} /></button>
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>📄 PAGE 1 — RECTO (Français)</span>
        </div>
        <div style={{ marginBottom: 20 }}><CardFace lang="fr" /></div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}>📄 PAGE 2 — VERSO (عربي)</span>
        </div>
        <div style={{ marginBottom: 24 }}><CardFace lang="ar" /></div>

        <a href={cardUrl} download target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--green)', color: '#fff', padding: '13px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
          <Download size={18} /> Télécharger PDF (Recto + Verso)
        </a>
      </div>
    </div>
  );
}
