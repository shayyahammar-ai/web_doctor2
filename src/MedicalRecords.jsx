import React from 'react';
import { Link } from 'react-router-dom';
import './MedicalRecords.css';

function MedicalRecords() {
  // بيانات وهمية للجدول
  const recordsData = [
    { id: '#48291', name: 'سارة أحمد', date: '12 أكتوبر 2023', time: '10:30 صباحاً', diagnosis: 'التهاب القصبات الحاد', status: 'مكتمل (صرف الدواء)', statusClass: 'completed-green', avatar: '👩🏻' },
    { id: '#48210', name: 'محمد العتيبي', date: '11 أكتوبر 2023', time: '02:15 مساءً', diagnosis: 'متابعة ضغط الدم', status: 'مكتمل (تحليل دم)', statusClass: 'completed-green', avatar: '👨🏻‍🦳' },
    { id: '#48192', name: 'عمر خالد', date: '10 أكتوبر 2023', time: '09:00 صباحاً', diagnosis: 'ربو تحسسي', status: 'مكتمل (تحويل أخصائي)', statusClass: 'completed-green', avatar: '🧑🏻' },
    { id: '#48150', name: 'نورة محمد', date: '09 أكتوبر 2023', time: '11:45 صباحاً', diagnosis: 'صداع نصفي', status: 'ملغى (من قبل المريض)', statusClass: 'cancelled-red', avatar: 'ن.م' },
  ];

  return (
    <div className="dashboard-layout" dir="rtl">
      
      {/* القائمة الجانبية */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Clinico Logo" className="dash-logo" />
          <h3>عيادة بلس</h3>
          <p>نظام إدارة العيادة</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/dashboard">لوحة القيادة</Link></li>
            <li><Link to="/appointments">المواعيد</Link></li>
            <li><Link to="/patient-history">المرضى</Link></li>
            <li className="active"><Link to="/records">السجل الطبي</Link></li>
            <li><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
           <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content background-gray">
        
        {/* الترويسة الرئيسية للصفحة */}
        <div className="page-header-container">
          <div className="page-title-box">
            <h1>المواعيد المنتهية</h1>
            <p>سجل أرشيفي لجميع المواعيد المكتملة.</p>
          </div>
          <button className="export-btn">
            📥 تصدير (Excel/CSV)
          </button>
        </div>

        <div className="records-content-area">
          
          {/* قسم الفلاتر */}
          <div className="filter-card">
            <div className="filter-inputs">
              <div className="input-group search-group">
                <label>البحث العام</label>
                <input type="text" placeholder="اسم المريض، التشخيص..." />
              </div>
              <div className="input-group">
                <label>من تاريخ</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>إلى تاريخ</label>
                <input type="date" />
              </div>
            </div>
            <div className="filter-actions">
              <button className="apply-filter-btn">تطبيق الفلاتر</button>
            </div>
          </div>

          {/* جدول السجل الطبي */}
          <div className="table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>التاريخ والوقت</th>
                  <th>المريض</th>
                  <th>التشخيص المبدئي</th>
                  <th>الحالة النهائية</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {recordsData.map((record, index) => (
                  <tr key={index}>
                    <td className="date-time-cell">
                      <strong>{record.date}</strong>
                      <span>{record.time}</span>
                    </td>
                    <td className="patient-info">
                      <div className="avatar-circle">{record.avatar}</div>
                      <div>
                        <strong>{record.name}</strong>
                        <span>ID: {record.id}</span>
                      </div>
                    </td>
                    <td className="diagnosis-cell">{record.diagnosis}</td>
                    <td>
                      <span className={`record-badge ${record.statusClass}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <button className="view-eye-btn">👁️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* الترقيم (Pagination) */}
            <div className="pagination">
              <span>عرض 1-4 من 120 نتيجة</span>
              <div className="page-numbers">
                <button className="page-btn">❯</button>
                <button className="page-btn">❮</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default MedicalRecords;