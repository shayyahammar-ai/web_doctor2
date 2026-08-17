import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Appointments.css';

function Appointments() {
  // الحالات التفاعلية
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, scheduled, arrived, completed, no_show
  const [stats, setStats] = useState({
    total_today_patients: 0,
    counts_by_status: { scheduled: 0, arrived: 0, completed: 0, no_show: 0 }
  });
  const [appointmentsData, setAppointmentsData] = useState({
    scheduled: [],
    arrived: [],
    completed: [],
    no_show: []
  });

  // جلب البيانات من الـ API عند فتح الصفحة
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // التوكن المحفوظ عند التسجيل

      const response = await axios.get('https://api-shayyah.abukm.com/api/doctor/today-appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.data.status) {
        setStats(response.data.statistics);
        setAppointmentsData(response.data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب مواعيد اليوم:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لتجميع وقراءة القائمة بحسب التبويب النشط
  const getDisplayedAppointments = () => {
    if (activeTab === 'all') {
      return [
        ...(appointmentsData.scheduled || []),
        ...(appointmentsData.arrived || []),
        ...(appointmentsData.completed || []),
        ...(appointmentsData.no_show || []),
      ];
    }
    return appointmentsData[activeTab] || [];
  };

  // دالة لتحديد شكل ونوع الحالة (Badge Color & Text)
  const renderStatusBadge = (statusType) => {
    switch (statusType) {
      case 'arrived':
        return <span className="status-badge active"><span className="dot"></span> جاري الفحص</span>;
      case 'scheduled':
        return <span className="status-badge waiting"><span className="dot"></span> قيد الانتظار</span>;
      case 'completed':
        return <span className="status-badge done"><span className="dot"></span> انتهت</span>;
      case 'no_show':
        return <span className="status-badge noshow"><span className="dot"></span> لم يحضر</span>;
      default:
        return <span className="status-badge">{statusType}</span>;
    }
  };

  const currentList = getDisplayedAppointments();

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

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        
        {/* الترويسة */}
        <header className="appointments-header">
          <div className="header-title">
            <h1>مرضى اليوم</h1>
            <p>{stats.total_today_patients} مريض مجدول لهذا اليوم</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="البحث عن مريض..." />
            </div>
            <button className="add-btn">+ إضافة موعد</button>
          </div>
        </header>

        {/* التبويبات المربوطة بالأعداد الحقيقية */}
        <div className="tabs-container">
          <ul className="tabs">
            <li 
              className={activeTab === 'all' ? 'active' : ''} 
              onClick={() => setActiveTab('all')}
            >
              الكل ({stats.total_today_patients})
            </li>
            <li 
              className={activeTab === 'scheduled' ? 'active' : ''} 
              onClick={() => setActiveTab('scheduled')}
            >
              قيد الانتظار ({stats.counts_by_status.scheduled})
            </li>
            <li 
              className={activeTab === 'arrived' ? 'active' : ''} 
              onClick={() => setActiveTab('arrived')}
            >
              جاري الفحص ({stats.counts_by_status.arrived})
            </li>
            <li 
              className={activeTab === 'completed' ? 'active' : ''} 
              onClick={() => setActiveTab('completed')}
            >
              انتهت ({stats.counts_by_status.completed})
            </li>
          </ul>
        </div>

        {/* جدول المواعيد */}
        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>جاري تحميل البيانات...</div>
          ) : (
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
                {currentList.length > 0 ? (
                  currentList.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="patient-info">
                        <div className="avatar-circle">
                          {item.patient?.name ? item.patient.name.charAt(0) : '👤'}
                        </div>
                        <div>
                          <strong>{item.patient?.name || item.full_name || 'مريض'}</strong>
                          <span>Date:  {item.appointment_date || item.id}</span>
                        </div>
                      </td>
                      <td>{item.start_time || item.time || '--:--'}</td>
                      <td>{item.notes || item.type || 'استشارة'}</td>
                      <td>{renderStatusBadge(item.status || activeTab)}</td>
                      <td>
                        <button className="action-btn">📁</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                      لا توجد مواعيد في هذا القسم اليوم.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* الترقيم */}
          <div className="pagination">
            <span>عرض {currentList.length} من {stats.total_today_patients}</span>
            <div className="page-numbers">
              <button className="page-btn">❯</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">❮</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Appointments;