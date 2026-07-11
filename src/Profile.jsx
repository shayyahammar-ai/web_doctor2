import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

function Profile() {
  return (
    <div className="dashboard-layout" dir="rtl">
      
      {/* القائمة الجانبية (مع الزر الجديد) */}
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
            {/* الزر الجديد تحت الرسائل */}
            <li className="active"><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content background-gray">
        
        {/* الشريط العلوي */}
        <header className="top-header profile-top-header">
          <div className="header-right">
            <h2>الملف الشخصي للطبيب</h2>
            <p className="subtitle">إدارة بياناتك الشخصية، ساعات العيادة، والتفضيلات المهنية.</p>
          </div>
          <div className="header-left profile-header-actions">
            <button className="emergency-btn">⚠️ طوارئ</button>
            <div className="search-box">
              <input type="text" placeholder="بحث..." />
            </div>
            <button className="icon-btn">⚙️</button>
            <button className="icon-btn">❓</button>
            <button className="logout-btn">تسجيل الخروج</button>
          </div>
        </header>

        <div className="profile-content-area">
          <div className="profile-grid">
            
            {/* العمود الأيمن (البيانات الرئيسية والإعدادات) */}
            <div className="profile-main-column">
              
              {/* بطاقة المعلومات الشخصية والمهنية */}
              <div className="profile-card">
                <div className="card-header-title">
                  <h3>📄 المعلومات الشخصية والمهنية</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>الاسم الأول</label>
                    <input type="text" defaultValue="أحمد" />
                  </div>
                  <div className="form-group">
                    <label>اسم العائلة</label>
                    <input type="text" defaultValue="العتيبي" />
                  </div>
                  <div className="form-group full-width">
                    <label>التخصص الدقيق</label>
                    <input type="text" defaultValue="استشاري جراحة القلب والأوعية الدموية" />
                  </div>
                  <div className="form-group">
                    <label>رقم الترخيص الطبي</label>
                    <input type="text" defaultValue="MOH-8839201" />
                  </div>
                  <div className="form-group">
                    <label>تاريخ انتهاء الترخيص</label>
                    <input type="date" defaultValue="2026-10-15" />
                  </div>
                  <div className="form-group full-width">
                    <label>نبذة مختصرة (تظهر للمرضى)</label>
                    <textarea defaultValue="أكثر من 15 عاماً من الخبرة في جراحات القلب المفتوح وتغيير الصمامات. حاصل على البورد الكندي في جراحة القلب والصدر."></textarea>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="cancel-btn">إلغاء التغييرات</button>
                  <button className="save-btn">حفظ المعلومات</button>
                </div>
              </div>

              {/* صف سفلي يحتوي على التفضيلات وساعات العمل */}
              <div className="profile-bottom-row">
                
                {/* تفضيلات النظام */}
                <div className="profile-card preferences-card">
                  <div className="card-header-title">
                    <h3>⚙️ تفضيلات النظام</h3>
                  </div>
                  <div className="preferences-list">
                    <div className="pref-item">
                      <label>التنبيهات والإشعارات</label>
                    </div>
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      إشعارات الحالات الحرجة الفورية (SMS)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      ملخص المواعيد اليومي عبر البريد
                    </label>
                  </div>
                </div>

                {/* ساعات العيادة */}
                <div className="profile-card hours-card">
                  <div className="card-header-title">
                    <h3>🕒 ساعات العيادة</h3>
                  </div>
                  <div className="hours-list">
                    
                    <div className="hour-row">
                      <span className="day-name">الأحد</span>
                      <div className="time-inputs">
                        <input type="time" defaultValue="08:00" />
                        <span>-</span>
                        <input type="time" defaultValue="15:00" />
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="hour-row">
                      <span className="day-name">الإثنين</span>
                      <div className="time-inputs">
                        <input type="time" defaultValue="09:00" />
                        <span>-</span>
                        <input type="time" defaultValue="16:00" />
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="hour-row disabled-row">
                      <span className="day-name">الثلاثاء</span>
                      <div className="time-inputs">
                        <input type="time" disabled />
                        <span>-</span>
                        <input type="time" disabled />
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>

                  </div>
                  <button className="update-hours-btn">تحديث المواعيد</button>
                </div>

              </div>
            </div>

            {/* العمود الأيسر (بطاقة الطبيب ومعلومات التواصل) */}
            <div className="profile-side-column">
              
              {/* بطاقة هوية الطبيب */}
              <div className="doctor-id-card">
                <div className="id-card-header"></div>
                <div className="id-card-avatar">
                  <img src="/logo.png" alt="Doctor Profile" />
                </div>
                <div className="id-card-info">
                  <h3>د. أحمد العتيبي</h3>
                  <span className="specialty-badge">استشاري جراحة القلب</span>
                </div>
                <div className="id-card-numbers">
                  <div className="number-box">
                    <span>رقم الملف (Profile ID)</span>
                    <strong>DR-8472-A</strong>
                  </div>
                  <div className="number-box">
                    <span>رقم الحساب (User ID)</span>
                    <strong>USR-9931-X</strong>
                  </div>
                </div>
              </div>

              {/* معلومات التواصل */}
              <div className="profile-card contact-card">
                <div className="card-header-title">
                  <h3>📞 معلومات التواصل</h3>
                </div>
                <div className="contact-list">
                  <div className="contact-item">
                    <span className="icon">✉️</span>
                    <div>
                      <span className="contact-label">البريد الإلكتروني المهني</span>
                      <strong>ahmed.alotabi@clinic.com</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="icon">📞</span>
                    <div>
                      <span className="contact-label">هاتف الطوارئ</span>
                      <strong>+123 50 966 4567</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="icon">🏢</span>
                    <div>
                      <span className="contact-label">المكتب الرئيسي</span>
                      <strong>المبنى أ، الطابق الرابع، جناح 402</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;