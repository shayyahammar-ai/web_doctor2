import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // تم إزالة useNavigate لأننا لن نحتاجها
import axios from 'axios';
import './PatientHistory.css';

function PatientHistory() {
  const { id } = useParams();
  
  // 1. أضفنا State لحفظ رقم المريض النشط حالياً (الافتراضي من الرابط أو 2)
  const [activePatientId, setActivePatientId] = useState(id || 2);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // 2. تحديث البيانات تلقائياً متى ما تغير رقم المريض النشط (activePatientId)
  useEffect(() => {
    fetchPatientData(activePatientId);
  }, [activePatientId]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performServerSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performServerSearch = async (query) => {
    setIsSearching(true);
    setSearchError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'https://api-shayyah.abukm.com/api/search_patient',
        { search: query },
        { 
          headers: { 
            Authorization: `Bearer ${token}`, 
            Accept: 'application/json',
            'Content-Type': 'application/json' 
          } 
        }
      );

      if (res.data?.status === true) {
        setSearchResults(res.data.data || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('خطأ أثناء البحث:', error);
      setSearchError('حدث خطأ أثناء الاتصال بالسيرفر للبحث.');
    } finally {
      setIsSearching(false);
    }
  };

  // 3. تمرير الـ id للدالة بدلاً من الاعتماد على patientId الثابت
  const fetchPatientData = async (currentId) => {
    setLoading(true);
    setProfile(null); // مسح البيانات القديمة لعدم تداخلها أثناء التحميل
    setMedicalHistory([]);

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('تنبيه: التوكن غير موجود في LocalStorage، يرجى إعادة تسجيل الدخول.');
    }

    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

    try {
      const profileRes = await axios.get(`https://api-shayyah.abukm.com/api/doctor/${currentId}/medical-profile`, { headers });
      if (profileRes.data?.status === 'success' || profileRes.data?.status === true) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.error('خطأ الملف الشخصي:', error);
    }

    try {
      const historyRes = await axios.get(`https://api-shayyah.abukm.com/api/patients/${currentId}/medical-history`, { headers });
      if (historyRes.data?.status === 'success' || historyRes.data?.status === true) {
        setMedicalHistory(historyRes.data.data || []);
      }
    } catch (error) {
      console.error('خطأ السجل الطبي:', error);
    }
    
    setLoading(false);
  };

  // 4. تعديل دالة النقر لتحديث الـ State محلياً بدلاً من الانتقال لمسار جديد (Navigate)
  const handleSelectPatient = (idToLoad) => {
    setSearchTerm('');
    setShowDropdown(false);
    
    // تحديث رقم المريض في نفس الصفحة ليتم جلب بياناته فوراً
    setActivePatientId(idToLoad);
    
    // اختياري: تحديث شكل الرابط في المتصفح ليتوافق مع المريض الجديد بدون إعادة تحميل الصفحة
    window.history.replaceState(null, '', `/patient-history/${idToLoad}`);
  };

  const personalInfo = profile?.personal_info;
  const medicalBg = profile?.medical_background;

  return (
    <div className="dashboard-layout" dir="rtl">
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

      <main className="main-content background-gray">
        <header className="top-header">
          <div className="header-right">
            <h2>التاريخ الطبي للمريض</h2>
            
            <div className="search-box" style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="البحث بالاسم أو ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {showDropdown && searchTerm.trim() !== '' && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', border: '1px solid #ddd',
                  borderRadius: '8px', zIndex: 1000, maxHeight: '300px',
                  overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  marginTop: '5px'
                }}>
                  {isSearching ? (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>جاري البحث...</div>
                  ) : searchError ? (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#d9534f' }}>{searchError}</div>
                  ) : searchResults.length > 0 ? (
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {searchResults.map((patient) => {
                        const patientName = patient.user?.first_name 
                                            ? `${patient.user.first_name} ${patient.user.last_name || ''}`
                                            : patient.user?.name || `مريض غير مسمى (ID: ${patient.id})`;

                        return (
                          <li 
                            key={patient.id}
                            onClick={() => handleSelectPatient(patient.id)}
                            style={{ padding: '10px 15px', borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', justifyContent: 'space-between' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                          >
                            <span style={{ fontWeight: 'bold', color: '#333' }}>{patientName}</span>
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>ID: {patient.id}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div style={{ padding: '15px', textAlign: 'center', color: '#999' }}>لا يوجد مريض مطابق لـ "{searchTerm}"</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
            جاري تحميل البيانات الطبية للمريض...
          </div>
        ) : (
          <div className="patient-content-area">
            <div className="top-cards-row">
              <div className="info-card patient-main-info">
                <div className="patient-details">
                  <div className="name-status">
                    <h2>{personalInfo?.name || 'غير محدد'}</h2>
                    <span className={`status-badge ${medicalBg?.chronic_diseases ? 'critical' : 'stable'}`}>
                      {medicalBg?.chronic_diseases ? 'مريض مزمن' : 'مستقر'}
                    </span>
                  </div>
                  <div className="patient-meta">
                    <span>ID: #{personalInfo?.id || activePatientId}</span>
                    <span>العمر: {personalInfo?.age ? `${personalInfo.age} عاماً` : '--'}</span>
                    <span>فصيلة الدم: {personalInfo?.blood_type || '--'}</span>
                    <span>الجنس: {personalInfo?.gender || '--'}</span>
                  </div>
                </div>
                <div className="patient-avatar-large">
                  <img src="/logo.png" alt="Patient" />
                </div>
              </div>

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

            <div className="timeline-container">
              {medicalHistory.length > 0 ? (
                medicalHistory.map((item, index) => (
                  <div key={item.id || index} className={`timeline-item ${index % 2 !== 0 ? 'alt-layout' : ''}`}>
                    <div className="timeline-card">
                      <div className="timeline-header">
                        <h4>{item.diagnosis || 'تشخيص سريري'}</h4>
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

                      <div className="doctor-profile-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                        <img 
                          src={item.doctor?.image || '/logo.png'} 
                          alt={item.doctor?.full_name || 'Doctor'} 
                          style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }}
                          onError={(e) => { e.target.src = '/logo.png'; }} 
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