import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from employees.models import Department, Employee

# Departments
depts = [
    ('Direction Générale', 'الإدارة العامة'),
    ('Direction Administrative et Financière', 'الإدارة المالية والإدارية'),
    ('Direction Technique', 'الإدارة التقنية'),
    ('Direction des Programmes', 'إدارة البرامج'),
    ('Ressources Humaines', 'الموارد البشرية'),
]
dept_objs = {}
for name, name_ar in depts:
    d, _ = Department.objects.get_or_create(name=name, defaults={'name_ar': name_ar})
    dept_objs[name] = d

# Employees
employees = [
    {
        'first_name': 'ELY CHEIKH', 'last_name': 'TALEB AHMED',
        'first_name_ar': 'إلي الشيخ', 'last_name_ar': 'طالب أحمد',
        'position': 'DIRECTEUR ADMINISTRATIF ET FINANCIER',
        'position_ar': 'المدير الإداري والمالي',
        'department': 'Direction Administrative et Financière',
        'email': 'elycheikhtelebahmed1@gmail.com',
        'phone': '+(222) 43747473',
        'fax': '+(222) 45255547',
        'address': 'Lot n°184 Ext NOT Module B à Nouakchott-Mauritanie',
    },
    {
        'first_name': 'AHMED', 'last_name': 'OULD SIDI',
        'first_name_ar': 'أحمد', 'last_name_ar': 'ولد سيدي',
        'position': 'DIRECTEUR GÉNÉRAL',
        'position_ar': 'المدير العام',
        'department': 'Direction Générale',
        'email': 'dg@tdm.mr',
        'phone': '+(222) 43000001',
        'fax': '+(222) 45000001',
        'address': 'Lot n°184 Ext NOT Module B à Nouakchott-Mauritanie',
    },
    {
        'first_name': 'FATIMA', 'last_name': 'MINT CHEIKH',
        'first_name_ar': 'فاطمة', 'last_name_ar': 'منت الشيخ',
        'position': 'DIRECTRICE TECHNIQUE',
        'position_ar': 'المديرة التقنية',
        'department': 'Direction Technique',
        'email': 'technique@tdm.mr',
        'phone': '+(222) 43000002',
        'fax': '+(222) 45000002',
        'address': 'Lot n°184 Ext NOT Module B à Nouakchott-Mauritanie',
    },
    {
        'first_name': 'MOHAMED', 'last_name': 'OULD BRAHIM',
        'first_name_ar': 'محمد', 'last_name_ar': 'ولد إبراهيم',
        'position': 'RESPONSABLE RESSOURCES HUMAINES',
        'position_ar': 'مسؤول الموارد البشرية',
        'department': 'Ressources Humaines',
        'email': 'rh@tdm.mr',
        'phone': '+(222) 43000003',
        'fax': '',
        'address': 'Lot n°184 Ext NOT Module B à Nouakchott-Mauritanie',
    },
    {
        'first_name': 'MARIEM', 'last_name': 'MINT AHMED',
        'first_name_ar': 'مريم', 'last_name_ar': 'منت أحمد',
        'position': 'DIRECTRICE DES PROGRAMMES',
        'position_ar': 'مديرة البرامج',
        'department': 'Direction des Programmes',
        'email': 'programmes@tdm.mr',
        'phone': '+(222) 43000004',
        'fax': '+(222) 45000004',
        'address': 'Lot n°184 Ext NOT Module B à Nouakchott-Mauritanie',
    },
]

for e in employees:
    dept = dept_objs.get(e.pop('department'))
    Employee.objects.get_or_create(
        first_name=e['first_name'], last_name=e['last_name'],
        defaults={**e, 'department': dept}
    )

print(f"✅ {Employee.objects.count()} employés créés")
print(f"✅ {Department.objects.count()} départements créés")
