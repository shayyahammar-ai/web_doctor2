import React, { useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { requestPermissionAndGetToken, onForegroundMessage } from './firebase'; // استيراد دوال الإشعارات

function Dashboard() {

  useEffect(() => {
    // 1. طلب الإذن وجلب الـ FCM Token عند دخول الداشبورد
    const setupFCM = async () => {
      const token = await requestPermissionAndGetToken();
      if (token) {
        console.log("Token to send to Laravel:", token);
        
        // TODO: هنا يمكنك إرسال الـ token إلى سيرفر Laravel عبر طلب POST
        // مثال:
        // axios.post('http://127.0.0.1:8000/api/save-token', { fcm_token: token }, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
      }
    };

    setupFCM();

    // 2. تشغيل مستمع الإشعارات المباشرة والتطبيق مفتوح
    onForegroundMessage();
  }, []);

  return (
    <div className="dashboard-layout" dir="rtl">
      
      {/* القائمة الجانبية (Sidebar) */}
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
            <li><Link to="/records">السجل الطبي</Link></li>
            <li><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
            <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي للداشبورد */}
      <main className="main-content">
        
        {/* الشريط العلوي (Header) */}
        <header className="top-header">
          <div className="header-right">
            <h2>عيادة بلس</h2>
            <div className="search-box">
              <input type="text" placeholder="البحث..." />
            </div>
          </div>
          <div className="header-left">
            <button className="add-appointment-btn">+ إضافة موعد</button>
          </div>
        </header>

        {/* مساحة العمل (البطاقات والجداول) */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>نظرة عامة</h1>
            <p>مرحباً د. أحمد، إليك ملخص نشاط العيادة اليوم.</p>
          </div>

          <div className="stats-cards">
            <div className="card">
              <h4>عدد مرضى اليوم</h4>
              <h2>42</h2>
            </div>
            <div className="card">
              <h4>استشارات قيد الانتظار</h4>
              <h2>8</h2>
            </div>
            <div className="card urgent-card">
              <h4>حالات عاجلة</h4>
              <h2 className="urgent-text">2</h2>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;