import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './PatientHistory.css';

function PatientHistory() {
  const { id } = useParams();
  const patientId = id || 1;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('تنبيه: التوكن غير موجود في LocalStorage، يرجى إعادة تسجيل الدخول.');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    // 1. جلب بيانات الملف الشامل
    try {
      const profileRes = await axios.get(
        `https://api-shayyah.abukm.com/api/doctor/${patientId}/medical-profile`,
        { headers }
      );
      if (profileRes.data?.status === 'success' || profileRes.data?.status === true) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الملف الشخصي للمريض:', error.response?.data || error.message);
    }

    // 2. جلب السجل الطبي التاريخي
    try {
      const historyRes = await axios.get(
        `https://api-shayyah.abukm.com/api/patients/${patientId}/medical-history`,
        { headers }
      );
      if (historyRes.data?.status === 'success' || historyRes.data?.status === true) {
        setMedicalHistory(historyRes.data.data || []);
      }
    } catch (error) {
      console.error('خطأ في جلب السجل الطبي للمريض:', error.response?.data || error.message);
    }

    setLoading(false);
  };

  const personalInfo = profile?.personal_info;
  const medicalBg = profile?.medical_background;

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
            <li className="active"><Link to="/patient-history">المرضى</Link></li>
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            جاري تحميل البيانات الطبية للمريض...
          </div>
        ) : (
          <div className="patient-content-area">
            {/* البطاقات العلوية: معلومات المريض والمؤشرات الحيوية */}
            <div className="top-cards-row">
              {/* بطاقة معلومات المريض */}
              <div className="info-card patient-main-info">
                <div className="patient-details">
                  <div className="name-status">
                    <h2>{personalInfo?.name || 'غير محدد'}</h2>
                    <span className="status-badge stable">
                      {medicalBg?.chronic_diseases ? 'مريض مزمن' : 'مستقر'}
                    </span>
                  </div>
                  <div className="patient-meta">
                    <span>ID: #{personalInfo?.id || patientId}</span>
                    <span>العمر: {personalInfo?.age ? `${personalInfo.age} عاماً` : '--'}</span>
                    <span>فصيلة الدم: {personalInfo?.blood_type || '--'}</span>
                                        <span>الجنس: {personalInfo?.gender || '--'}</span>


                  </div>
                </div>
                <div className="patient-avatar-large">
                  <img src="/logo.png" alt="Patient" />
                </div>
              </div>

              {/* بطاقة المؤشرات الحيوية */}
              <div className="info-card vitals-card">
                <div className="vitals-header">
                  <h3>المؤشرات الحيوية <br />(أحدث)</h3>
                </div>
                <div className="vitals-data">
                  <div className="vital-item">
                    <span className="vital-label">الوزن</span>
                    <span className="vital-value">{personalInfo?.weight ? `${personalInfo.weight} kg` : '--'}</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">الطول</span>
                    <span className="vital-value">{personalInfo?.taller ? `${personalInfo.taller} cm` : '--'}</span>
                  </div>
                </div>
              </div>
            </div>

          
{/* الأمراض المزمنة، الحساسية، والأمراض الوراثية */}
{medicalBg && (medicalBg.chronic_diseases || medicalBg.allergies || medicalBg.hereditary || medicalBg.hereditary_diseases) && (
  <div style={{ marginBottom: '20px', padding: '16px 20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    
    <strong style={{ color: '#d9534f', display: 'block', marginBottom: '12px', fontSize: '1.05rem' }}>
      ⚠️ تنبيهات صحية:
    </strong>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {medicalBg.chronic_diseases && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#333', minWidth: '110px' }}>أمراض مزمنة:</span>
          <span style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
            {medicalBg.chronic_diseases}
          </span>
        </div>
      )}

      {medicalBg.allergies && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#333', minWidth: '110px' }}>حساسية:</span>
          <span style={{ color: '#c2410c', backgroundColor: '#fff7ed', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
            {medicalBg.allergies}
          </span>
        </div>
      )}

      {(medicalBg.hereditary || medicalBg.hereditary_diseases) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#333', minWidth: '110px' }}>أمراض وراثية:</span>
          <span style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '500' }}>
            {medicalBg.hereditary || medicalBg.hereditary_diseases}
          </span>
        </div>
      )}

    </div>
  </div>
)}

            {/* الخط الزمني للتاريخ الطبي */}
            <div className="timeline-container">
              {medicalHistory.length > 0 ? (
                medicalHistory.map((item, index) => (
                  <div 
                    key={item.id || index} 
                    className={`timeline-item ${index % 2 !== 0 ? 'alt-layout' : ''}`}
                  >
                    <div className="timeline-card">
                      <div className="timeline-header">
                        <h4>{item.diagnosis || 'تشخيص سريري'}</h4>
                        
                        {/* 1. عرض تاريخ الموعد ووقت البداية */}
                        <div className="appointment-meta" style={{ fontSize: '0.85rem', color: '#666', textAlign: 'left' }}>
                          {item.appointment?.appointment_date && (
                            <div>📅 {item.appointment.appointment_date}</div>
                          )}
                          {item.appointment?.start_time && (
                            <div>⏰ {item.appointment.start_time}</div>
                          )}
                        </div>
                      </div>
                      
                      {item.chief_complaint && (
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                          الشكوى: {item.chief_complaint}
                        </p>
                      )}
                      
                      <p>{item.notes || 'لا توجد ملاحظات إضافية'}</p>
                      
                      {/* 2. عرض صورة الطبيب مع اسمه */}
                      <div className="doctor-profile-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <img 
                          src={item.doctor?.image || '/logo.png'} 
                          alt={item.doctor?.full_name || 'Doctor'} 
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #ddd'
                          }}
                          onError={(e) => { e.target.src = '/logo.png'; }} // صورة افتراضية عند فشل التحميل
                        />
                        <span className="doctor-name" style={{ color: '#0f766e', fontWeight: '600' }}>
                          د. {item.doctor?.full_name || 'طبيب المعالجة'}
                        </span>
                      </div>
                    </div>

                    <div className={`timeline-icon ${index % 2 === 0 ? 'green-icon' : 'blue-icon'}`}>
                      📄
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', background: '#fff', borderRadius: '8px' }}>
                  لا يوجد سجل طبي تاريخي مدون لهذا المريض بعد.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientHistory;