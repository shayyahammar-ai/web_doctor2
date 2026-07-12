import React from 'react';
import { Link } from 'react-router-dom';
import './Appointments.css';

function Appointments() {
  // بيانات وهمية مؤقتة لملء الجدول ريثما يتم الربط
  const patientsData = [
    { id: '#P-10024', name: 'أحمد محمود', time: '10:30 صباحاً', type: 'استشارة عامة', status: 'جاري الفحص', statusType: 'active', avatar: '👨🏻‍🦱' },
    { id: '#P-10055', name: 'سارة عبد الرحمن', time: '11:00 صباحاً', type: 'متابعة تحاليل', status: 'قيد الانتظار', statusType: 'waiting', avatar: 'س' },
    { id: '#P-09982', name: 'فاطمة علي', time: '11:30 صباحاً', type: 'فحص دوري', status: 'قيد الانتظار', statusType: 'waiting', avatar: '🧕🏻' },
    { id: '#P-10101', name: 'محمد يوسف', time: '09:00 صباحاً', type: 'ألم في المعدة', status: 'انتهت', statusType: 'done', avatar: 'م' },
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
            {/* استخدام Link للتنقل بدون إعادة تحميل الصفحة */}
            <li><Link to="/dashboard">لوحة القيادة</Link></li>
            <li className="active"><Link to="/appointments">المواعيد</Link></li>
            <li><Link to="/patient-history">المرضى</Link></li>
            <li><Link to="/records">السجل الطبي</Link></li>
            <li><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
            <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي لصفحة المواعيد */}
      <main className="main-content">
        
        {/* الترويسة (Header) الخاصة بالمواعيد */}
        <header className="appointments-header">
          <div className="header-title">
            <h1>مرضى اليوم</h1>
            <p>12 مريض مجدول لهذا اليوم</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="البحث عن مريض..." />
            </div>
            <button className="add-btn">+ إضافة موعد</button>
          </div>
        </header>

        {/* قسم التبويبات (Tabs) */}
        <div className="tabs-container">
          <ul className="tabs">
            <li className="active">الكل (12)</li>
            <li>قيد الانتظار (4)</li>
            <li>جاري الفحص (1)</li>
            <li>انتهت (7)</li>
          </ul>
        </div>

        {/* جدول المواعيد */}
        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>المريض</th>
                <th>الوقت</th>
                <th>نوع الموعد</th>
                <th>الحالة</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map((patient, index) => (
                <tr key={index}>
                  <td className="patient-info">
                    <div className="avatar-circle">{patient.avatar}</div>
                    <div>
                      <strong>{patient.name}</strong>
                      <span>ID: {patient.id}</span>
                    </div>
                  </td>
                  <td>{patient.time}</td>
                  <td>{patient.type}</td>
                  <td>
                    <span className={`status-badge ${patient.statusType}`}>
                      <span className="dot"></span> {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">📁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* الترقيم (Pagination) */}
          <div className="pagination">
            <span>عرض 1 إلى 4 من 12</span>
            <div className="page-numbers">
              <button className="page-btn">❯</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">❮</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Appointments;