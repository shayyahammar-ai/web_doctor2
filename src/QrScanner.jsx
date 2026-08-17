import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import './QrScanner.css';

function QrScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!scanResult) {
      const qrCodeInstance = new Html5Qrcode("reader");
      html5QrCodeRef.current = qrCodeInstance;

      qrCodeInstance.start(
        { facingMode: "user" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // النجاح في القراءة
          qrCodeInstance.stop().then(() => {
            setScanResult(decodedText);
          }).catch((err) => {
            console.error("خطأ عند إيقاف الكاميرا:", err);
            setScanResult(decodedText);
          });
        },
        (errorMessage) => {
          // تجاهل أخطاء البحث المستمرة عن الرمز
        }
      ).catch((err) => {
        console.error("تعذر بدء تشغيل الكاميرا:", err);
        setError("تعذر الوصول إلى الكاميرا. تأكد من إعطاء الصلاحيات.");
      });
    }

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => {
          console.error("فشل تنظيف الكاميرا:", err);
        });
      }
    };
  }, [scanResult]);

  useEffect(() => {
    if (scanResult) {
      const fetchPatientProfile = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://api-shayyah.abukm.com/api/patients/${scanResult}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setPatientData(response.data.data);
          setLoading(false);
        } catch (err) {
          console.error("حدث خطأ أثناء جلب الإضبارة:", err);
          setError("تعذر جلب ملف المريض. تأكد من صحة رمز الـ QR.");
          setLoading(false);
        }
      };

      fetchPatientProfile();
    }
  }, [scanResult]);

  const handleScanAgain = () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.stop().catch(console.error);
    }
    setScanResult(null);
    setPatientData(null);
    setError(null);
  };

  return (
    <div className="qr-scanner-page" dir="rtl">
      <div className="qr-container">
        
        <header className="qr-header">
          <h2>📷 ماسح الإضبارة الطبية</h2>
          <Link to="/dashboard" className="back-btn">
             العودة للرئيسية ➔
          </Link>
        </header>

        {!scanResult && (
          <div className="scanner-section">
            <p>قم بتوجيه الكاميرا نحو رمز الـ QR الخاص بالمريض</p>
            <div id="reader"></div>
          </div>
        )}

        {loading && <div className="loading-text">جاري جلب الإضبارة الطبية...</div>}

        {error && (
          <div className="error-section">
            <p className="error-text">{error}</p>
            <button onClick={handleScanAgain} className="retry-btn">مسح رمز جديد</button>
          </div>
        )}

        {patientData && !loading && (
          <div className="patient-profile">
            <div className="profile-header">
              <h3>ملف المريض: {patientData.personal_info.name}</h3>
              <button onClick={handleScanAgain} className="retry-btn">مسح مريض آخر</button>
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <h4>المعلومات الشخصية</h4>
                <ul>
                  <li><strong>العمر:</strong> {patientData.personal_info.age} سنة</li>
                  <li><strong>تاريخ الميلاد:</strong> {patientData.personal_info.birth_date}</li>
                  <li><strong>الجنس:</strong> {patientData.personal_info.gender === 'male' ? 'ذكر' : 'أنثى'}</li>
                  <li><strong>زمرة الدم:</strong> <span className="blood-badge">{patientData.personal_info.blood_type}</span></li>
                  <li><strong>الوزن:</strong> {patientData.personal_info.weight} كغ</li>
                  <li><strong>الطول:</strong> {patientData.personal_info.taller} سم</li>
                </ul>
              </div>

              <div className="profile-card">
                <h4>الخلفية الطبية</h4>
                <ul>
                  <li><strong>الحساسية:</strong> {patientData.medical_background.allergies || 'لا يوجد'}</li>
                  <li><strong>الأمراض المزمنة:</strong> {patientData.medical_background.chronic_diseases || 'لا يوجد'}</li>
                  <li><strong>الأمراض الوراثية:</strong> {patientData.medical_background.hereditary || 'لا يوجد'}</li>
                </ul>
              </div>
            </div>

            {patientData.medical_history && patientData.medical_history.length > 0 && (
              <div className="profile-section-wide">
                <h4>السجل الطبي والزيارات السابقة</h4>
                <div className="history-list">
                  {patientData.medical_history.map((record) => (
                    <div key={record.record_id} className="history-item">
                                              <span className="doctor-name">الطبيب: {record.doctor_name}</span>

                      <div className="history-item-header">
                        
                        <span className="date-badge">{record.date}</span>
                      </div>
                      <div className="history-item-body">
                        <p><strong>الشكوى الرئيسية:</strong> {record.chief_complaint}</p>
                        <p><strong>التشخيص:</strong> {record.diagnosis}</p>
                        <p><strong>ملاحظات:</strong> {record.notes}</p>
                      </div>
                      
                      {record.prescription && (
                        <div className="prescription-box">
                          <h5>💊 الوصفة الطبية</h5>
                          {record.prescription.instructions && (
                            <p className="instructions"><strong>تعليمات:</strong> {record.prescription.instructions}</p>
                          )}
                          <ul className="medicines-list">
                            {record.prescription.medicines.map((med, idx) => (
                              <li key={idx}>
                                <strong>{med.name}</strong> - الجرعة: {med.dosage} ({med.frequency}) لمدة {med.duration}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-grid">
              {patientData.analyses && patientData.analyses.length > 0 && (
                <div className="profile-card">
                  <h4>التحاليل المخبرية</h4>
                  <ul className="files-list">
                    {patientData.analyses.map((analysis) => (
                      <li key={analysis.id}>
                        <a href={analysis.file_url} target="_blank" rel="noreferrer" className="file-link">
                          📄 {analysis.title} <span className="file-date">({analysis.date})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {patientData.attachments && patientData.attachments.length > 0 && (
                <div className="profile-card">
                  <h4>المرفقات الطبية</h4>
                  <ul className="files-list">
                    {patientData.attachments.map((attachment) => (
                      <li key={attachment.attachment_id}>
                        <a href={attachment.file_url} target="_blank" rel="noreferrer" className="file-link">
                          📎 {attachment.title} <span className="file-date">({attachment.upload_date.split(' ')[0]})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default QrScanner;