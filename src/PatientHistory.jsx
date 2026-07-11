import React from 'react';
import { Link } from 'react-router-dom';
import './PatientHistory.css';

function PatientHistory() {
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

            <li><Link to="/records">السجل الطبي</Link></li>
            <li><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
            <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content background-gray">
        
        {/* الشريط العلوي */}
        <header className="top-header">
          <div className="header-right">
            <h2>التاريخ الطبي للمريض</h2>
            <div className="search-box">
              <input type="text" placeholder="البحث..." />
            </div>
          </div>
        </header>

        <div className="patient-content-area">
          
          {/* البطاقات العلوية: معلومات المريض والمؤشرات الحيوية */}
          <div className="top-cards-row">
            
            {/* بطاقة معلومات المريض */}
            <div className="info-card patient-main-info">
              <div className="patient-details">
                <div className="name-status">
                  <h2>أحمد محمود يوسف</h2>
                  <span className="status-badge stable">مستقر</span>
                </div>
                <div className="patient-meta">
                  <span>ID: 9845-MR</span>
                  <span>العمر: 62 عاماً</span>
                  <span>فصيلة الدم: O+</span>
                </div>
              </div>
              <div className="patient-avatar-large">
                <img src="/logo.png" alt="Patient" /> {/* يمكنك استبدالها بصورة المريض لاحقاً */}
              </div>
            </div>

            {/* بطاقة المؤشرات الحيوية */}
            <div className="info-card vitals-card">
              <div className="vitals-header">
                <h3>المؤشرات الحيوية <br/>(أحدث)</h3>
              </div>
              <div className="vitals-data">
                <div className="vital-item">
                  <span className="vital-label">الضغط</span>
                  <span className="vital-value">120/80</span>
                </div>
                <div className="vital-item">
                  <span className="vital-label">السكر</span>
                  <span className="vital-value">95 mg/dL</span>
                </div>
              </div>
            </div>

          </div>

          {/* الخط الزمني (Timeline) للتاريخ الطبي */}
          <div className="timeline-container">
            
            {/* عنصر خط زمني: ملاحظات سريرية */}
            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <h4>ملاحظات سريرية</h4>
                  <span className="timeline-date">12 أكتوبر 2023</span>
                </div>
                <p>المريض يشكو من ألم خفيف في الصدر عند المجهود. تم إجراء تخطيط قلب (ECG) وكانت النتائج طبيعية. يوصى بمتابعة ضغط الدم بانتظام وتقليل الأملاح في النظام الغذائي.</p>
                <span className="doctor-name">د. سارة خليل - طبيب عام</span>
              </div>
              <div className="timeline-icon green-icon">📄</div>
            </div>

            {/* عنصر خط زمني: الأمراض المزمنة */}
            <div className="timeline-item alt-layout">
              <div className="timeline-card">
                <div className="timeline-header">
                  <h4 className="red-text">الأمراض المزمنة</h4>
                  <span className="timeline-date">15 مايو 2021</span>
                </div>
                <p>تم تشخيص المريض بارتفاع ضغط الدم الأولي (الدرجة الأولى). تم وصف دواء أملوديبين 5 ملغ يومياً. المريض مدخن ويحتاج إلى الإقلاع.</p>
                <span className="doctor-name">د. محمد القاضي - باطنية</span>
              </div>
              <div className="timeline-icon red-icon">💓</div>
            </div>

            {/* عنصر خط زمني: التشخيصات السابقة */}
            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-header">
                  <h4>التشخيصات السابقة</h4>
                  <span className="timeline-date">03 مارس 2019</span>
                </div>
                <p>التهاب الشعب الهوائية الحاد. تم علاجه بالمضادات الحيوية (أزيثروميسين) وموسعات الشعب الهوائية. تعافي كامل بعد أسبوعين.</p>
                <span className="doctor-name">د. رامي سعيد - صدرية</span>
              </div>
              <div className="timeline-icon blue-icon">🩺</div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default PatientHistory;