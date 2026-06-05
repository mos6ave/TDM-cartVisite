import { useEffect, useState } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getDepartments } from '../api';
import EmployeeModal from '../components/EmployeeModal';
import BusinessCardPreview from '../components/BusinessCardPreview';
import { Plus, Search, Edit2, Trash2, CreditCard, User, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [cardEmp, setCardEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (deptFilter) params.department = deptFilter;
    try {
      const r = await getEmployees(params);
      setEmployees(r.data);
    } catch (e) {
      toast.error('Impossible de charger les employés');
    }
    setLoading(false);
  };

  useEffect(() => { getDepartments().then(r => setDepartments(r.data)).catch(() => {}); }, []);
  useEffect(() => { load(); }, [search, deptFilter]);

  const handleSave = async (fd) => {
    if (modal === 'create') await createEmployee(fd);
    else await updateEmployee(modal.id, fd);
    toast.success(modal === 'create' ? '✅ Employé ajouté !' : '✅ Modifié !');
    setModal(null);
    load();
  };

  const handleDelete = async (emp) => {
    if (!confirm(`Supprimer ${emp.first_name} ${emp.last_name} ?`)) return;
    setDeleting(emp.id);
    await deleteEmployee(emp.id);
    toast.success('Employé supprimé');
    setDeleting(null);
    load();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--dark)', letterSpacing: '-0.02em' }}>Employés</h1>
          <p style={{ color: 'var(--gray)', marginTop: 3, fontSize: 13 }}>
            {loading ? '...' : `${employees.length} employé${employees.length !== 1 ? 's' : ''} enregistré${employees.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => setModal('create')} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--green)', color: '#fff',
          border: 'none', borderRadius: 10, padding: '10px 18px',
          cursor: 'pointer', fontWeight: 600, fontSize: 13,
          boxShadow: '0 4px 12px rgba(0,122,61,0.3)',
          transition: 'all 0.2s',
        }}>
          <Plus size={17} /> Ajouter un employé
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom ou poste..."
            style={{ width: '100%', padding: '10px 12px 10px 35px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, outline: 'none', background: 'var(--white)', transition: 'border 0.2s' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <Filter size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', pointerEvents: 'none' }} />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            style={{ padding: '10px 14px 10px 30px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, background: 'var(--white)', minWidth: 200, outline: 'none', cursor: 'pointer' }}>
            <option value="">Tous les départements</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          Chargement...
        </div>
      ) : employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)', background: 'var(--white)', borderRadius: 16, border: '2px dashed var(--border)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Aucun employé trouvé</div>
          <div style={{ fontSize: 13 }}>Cliquez sur "Ajouter un employé" pour commencer</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {employees.map(emp => (
            <div key={emp.id} className="hover-lift" style={{
              background: 'var(--white)', borderRadius: 14, overflow: 'hidden',
              boxShadow: 'var(--shadow)', border: '1px solid var(--border)',
            }}>
              {/* Card top colored bar */}
              <div style={{ height: 4, display: 'flex' }}>
                <div style={{ flex: 1, background: 'var(--red)' }} />
                <div style={{ flex: 1, background: 'var(--green)' }} />
                <div style={{ flex: 1, background: 'var(--yellow)' }} />
              </div>
              <div style={{ padding: '16px' }}>
                {/* Avatar + Info */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  {emp.photo ? (
                    <img src={emp.photo}
                      style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '2px solid var(--border)' }} alt="" />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #007A3D, #005A2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
                        {(emp.first_name[0] || '') + (emp.last_name[0] || '')}
                      </span>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {emp.first_name} {emp.last_name}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--bordeaux, #6B2737)', fontWeight: 600, marginTop: 3, lineHeight: 1.4 }}>
                      {emp.position}
                    </div>
                    {emp.department_name && (
                      <span style={{ display: 'inline-block', marginTop: 5, background: '#F0FDF4', color: 'var(--green)', fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
                        {emp.department_name}
                      </span>
                    )}
                  </div>
                </div>
                {/* Contact */}
                {(emp.email || emp.phone) && (
                  <div style={{ background: 'var(--light)', borderRadius: 8, padding: '8px 10px', marginBottom: 12, fontSize: 11.5, color: 'var(--gray)' }}>
                    {emp.email && <div style={{ marginBottom: emp.phone ? 3 : 0 }}>✉ {emp.email}</div>}
                    {emp.phone && <div>📞 {emp.phone}</div>}
                  </div>
                )}
                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setCardEmp(emp)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: '#F0FDF4', border: '1px solid #BBF7D0', color: 'var(--green)',
                    borderRadius: 8, padding: '7px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  }}>
                    <CreditCard size={14} /> Carte
                  </button>
                  <button onClick={() => setModal(emp)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB',
                    borderRadius: 8, padding: '7px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  }}>
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button onClick={() => handleDelete(emp)} disabled={deleting === emp.id} style={{
                    width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                    borderRadius: 8, padding: '7px', cursor: 'pointer',
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <EmployeeModal employee={modal === 'create' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
      {cardEmp && <BusinessCardPreview employee={cardEmp} onClose={() => setCardEmp(null)} />}
    </div>
  );
}
