import { useEffect, useState } from 'react';
import { getDepartments, createDepartment } from '../api';
import { Plus, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');

  const load = () => getDepartments().then(r => setDepartments(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createDepartment({ name, name_ar: nameAr });
    toast.success('Département ajouté !');
    setName(''); setNameAr('');
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>Départements</h1>
      {/* Add form */}
      <form onSubmit={add} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow)', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gray)', marginBottom: 6, textTransform: 'uppercase' }}>Nom (FR) *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Direction Générale..."
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14 }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gray)', marginBottom: 6, textTransform: 'uppercase' }}>الاسم بالعربية</label>
          <input value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="الإدارة العامة"
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, direction: 'rtl' }} />
        </div>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', cursor: 'pointer', fontWeight: 700 }}>
          <Plus size={16} /> Ajouter
        </button>
      </form>
      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {departments.map(d => (
          <div key={d.id} style={{ background: '#fff', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--green)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="var(--green)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
              {d.name_ar && <div style={{ fontSize: 12, color: 'var(--gray)', direction: 'rtl', marginTop: 3 }}>{d.name_ar}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
