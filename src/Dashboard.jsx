import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestPermissionAndGetToken, onForegroundMessage } from './firebase';

function Dashboard() {
  const [queueData, setQueueData] = useState({ current_patient: null, next_patient: null });
  const [loadingQueue, setLoadingQueue] = useState(true);

  useEffect(() => {
    // 1. طلب الإذن وجلب الـ FCM Token عند دخول الداشبورد
    const setupFCM = async () => {
      const token = await requestPermissionAndGetToken();
      if (token) {
        console.log("Token to send to Laravel:", token);
      }
    };

    setupFCM();

    // 2. تشغيل مستمع الإشعارات المباشرة والتطبيق مفتوح
    onForegroundMessage();

    // 3. جلب بيانات الدور الحالي (Current Queue)
    const fetchCurrentQueue = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api-shayyah.abukm.com/api/doctor/current-queue', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQueueData(response.data.data);
        setLoadingQueue(false);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب دور المرضى:", err);
        setLoadingQueue(false);
      }
    };

    fetchCurrentQueue();
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
            
            <div className="header-icons" style={{ display: 'flex', gap: '20px', marginRight: '30px', alignItems: 'center' }}>
              <Link to="/qr-scanner" title="ماسح QR" style={{ color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="5" height="5" x="3" y="3" rx="1"/>
                  <rect width="5" height="5" x="16" y="3" rx="1"/>
                  <rect width="5" height="5" x="3" y="16" rx="1"/>
                  <path d="M21 16v5h-5"/>
                  <path d="M21 21v.01"/>
                  <path d="M12 7v3"/>
                  <path d="M3 12h18"/>
                  <path d="M12 20v-3"/>
                  <path d="M12 12v.01"/>
                </svg>
              </Link>

              <Link to="/notifications" title="الإشعارات" style={{ color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </Link>
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

          {/* قسم عرض الدور الحالي (Queue) */}
          <div className="queue-section" style={{ marginTop: '30px' }}>
            <h3>دور المرضى الحالي</h3>
            <div className="stats-cards" style={{ marginTop: '15px' }}>
              <div className="card" style={{ borderRight: '4px solid #3498db' }}>
                <h4>المريض الحالي</h4>
                <h2>{loadingQueue ? 'جاري التحميل...' : (queueData?.current_patient || 'لا يوجد مريض حالياً')}</h2>
              </div>
              <div className="card" style={{ borderRight: '4px solid #f39c12' }}>
                <h4>المريض التالي</h4>
                <h2>{loadingQueue ? 'جاري التحميل...' : (queueData?.next_patient || 'لا يوجد مريض بالانتظار')}</h2>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Dashboard;