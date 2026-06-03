import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { getDepartments } from '../api';

const EMPTY = {
  first_name: '', last_name: '', first_name_ar: '', last_name_ar: '',
  position: '', position_ar: '', department: '',
  email: '', phone: '', fax: '', address: '', address_ar: '',
};

export default function EmployeeModal({ employee, onSave, onClose }) {
  const [form, setForm]       = useState(EMPTY);
  const [photo, setPhoto]     = useState(null);
  const [departments, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    getDepartments().then(r => setDepts(r.data)).catch(() => {});
    if (employee) {
      setForm({
        first_name:    employee.first_name    || '',
        last_name:     employee.last_name     || '',
        first_name_ar: employee.first_name_ar || '',
        last_name_ar:  employee.last_name_ar  || '',
        position:      employee.position      || '',
        position_ar:   employee.position_ar   || '',
        department:    employee.department    || '',
        email:         employee.email         || '',
        phone:         employee.phone         || '',
        fax:           employee.fax           || '',
        address:       employee.address       || '',
        address_ar:    employee.address_ar    || '',
      });
    }
  }, [employee]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      // Ajouter seulement les champs non vides
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          fd.append(k, v);
        }
      });
      if (photo) fd.append('photo', photo);
      await onSave(fd);
    } catch (err) {
      const msg = err?.response?.data
        ? Object.entries(err.response.data).map(([k,v]) => `${k}: ${v}`).join(' | ')
        : err.message;
      setError(msg);
    }
    setLoading(false);
  };

  const Field = ({ name, label, placeholder = '', type = 'text', required = false, dir }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
        marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
      </label>
      <input type={type} name={name} value={form[name]} onChange={handle}
        placeholder={placeholder} required={required} dir={dir}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
          borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Outfit',
          direction: dir || 'ltr', background: '#FAFAFA' }} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700,
        maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        {/* Header */}
        <div style={{ padding: '18px 24px', background: '#111827', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
            {employee ? '✏️ Modifier l\'employé' : '➕ Nouvel employé'}
          </h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff',
            display: 'flex', alignItems: 'center' }}><X size={18} /></button>
        </div>

        {/* Body */}
        <form onSubmit={submit} style={{ overflow: 'auto', flex: 1, padding: 24 }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8,
              padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
            <p style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>🇫🇷 Informations en Français</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field name="first_name" label="Prénom" placeholder="ELY CHEIKH" required />
            <Field name="last_name"  label="Nom"    placeholder="TALEB AHMED" required />
          </div>
          <Field name="position" label="Poste" placeholder="Directeur Administratif et Financier" required />

          <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '12px 16px', marginBottom: 18, marginTop: 6 }}>
            <p style={{ fontSize: 12, color: '#9A3412', fontWeight: 600 }}>🇲🇷 المعلومات بالعربية (اختياري)</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field name="first_name_ar" label="الاسم الأول" placeholder="اعل الشيخ" dir="rtl" />
            <Field name="last_name_ar"  label="اللقب"       placeholder="الطالب أحمد" dir="rtl" />
          </div>
          <Field name="position_ar" label="المنصب" placeholder="المدير الإداري والمالي" dir="rtl" />

          <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '12px 16px', marginBottom: 18, marginTop: 6 }}>
            <p style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>📋 Coordonnées</p>
          </div>

          {/* Département */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
              marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Département</label>
            <select name="department" value={form.department} onChange={handle}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
                borderRadius: 8, fontSize: 14, background: '#FAFAFA' }}>
              <option value="">-- Aucun --</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field name="email" label="Email" placeholder="nom@tdm.mr" type="email" />
            <Field name="phone" label="Téléphone" placeholder="+(222) 43747473" />
            <Field name="fax"   label="Fax"       placeholder="+(222) 45255547" />
          </div>
          <Field name="address"    label="Adresse (FR)" placeholder="Lot n°184 Ext NOT Module B à Nouakchott" />
          <Field name="address_ar" label="العنوان (AR)" placeholder="حي ب رقم 184 نواكشوط" dir="rtl" />

          {/* Photo */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
              marginBottom: 5, textTransform: 'uppercase' }}>Photo (optionnel)</label>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB',
                borderRadius: 8, fontSize: 13 }} />
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8,
            borderTop: '1px solid #E5E7EB', marginTop: 8 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 20px', border: '1.5px solid #E5E7EB', borderRadius: 8,
                background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
              Annuler
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '10px 24px', background: loading ? '#86EFAC' : '#007A3D',
                color: '#fff', border: 'none', borderRadius: 8, cursor: loading ? 'default' : 'pointer',
                fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Save size={16} />{loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
