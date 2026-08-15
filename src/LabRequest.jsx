import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './LabRequest.css';

function LabRequest() {
  const params = useParams();
  const appointmentId = params.appointmentId || 1; // رقم الموعد الافتراضي

  // 1. إدارة الحالة (State)
  const [selectedTests, setSelectedTests] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // إعدادات الـ API
  const BASE_URL = 'https://api-shayyah.abukm.com/api'; 
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  // قائمة الفحوصات المتاحة في الواجهة
  const allAvailableTests = [
    "Complete Blood Count (CBC)",
    "HbA1c",
    "Lipid Profile",
    "Kidney Function Test (KFT)",
    "Liver Function Test (LFT)",
    "Urinalysis",
    "Chest X-Ray (Chest X-Ray)",
    "Abdominal Ultrasound",
    "MRI"
  ];

  // التعامل مع تحديد أو إلغاء تحديد الفحص (Checkbox)
  const handleCheckboxChange = (testName) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  // تجهيز الـ Payload المرسل للـ API
  const getPayload = () => {
    if (selectedTests.length === 0) {
      alert("يرجى تحديد تحليل أو أشعة واحدة على الأقل.");
      return null;
    }

    return {
      appointment_id: Number(appointmentId),
      doctor_notes: doctorNotes,
      tests: selectedTests
    };
  };

  // أ. إرسال طلب جديد (POST)
  const handleStoreOrder = async () => {
    const payload = getPayload();
    if (!payload) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/appointments/${appointmentId}/lab-orders`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("تم إرسال طلب التحاليل والأشعة بنجاح!");
        // تخزين الـ ID ليتحول الزر تلقائياً إلى وضع التعديل
        if (data.id || data.order?.id) {
          setCurrentOrderId(data.id || data.order.id);
        }
      } else {
        alert("حدث خطأ أثناء إرسال الطلب.");
        console.error("Server Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  // ب. تحديث طلب سابق (PUT)
  const handleUpdateOrder = async () => {
    const payload = getPayload();
    if (!payload) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/update/lab-orders/${currentOrderId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("تم تحديث طلب التحاليل بنجاح!");
      } else {
        alert("حدث خطأ أثناء التحديث.");
        console.error("Update Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  // ج. جلب طلب سابق للعرض أو التعديل (GET)
  const fetchLabOrder = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/show/lab-orders/${orderId}`, {
        method: 'GET',
        headers: headers
      });
      const data = await response.json();
      
      if (response.ok && data.order) {
        setDoctorNotes(data.order.doctor_notes || '');
        // استخراج أسماء الفحوصات من المصفوفة القادمة من الـ API
        const fetchedTestNames = data.order.tests ? data.order.tests.map(t => t.test_name) : [];
        setSelectedTests(fetchedTestNames);
        setCurrentOrderId(orderId);
      } else {
        alert("لم يتم العثور على الطلب.");
      }
    } catch (error) {
      console.error("Error fetching lab order:", error);
    }
  };

  // د. إعادة تعيين النموذج
  const handleReset = () => {
    setSelectedTests([]);
    setDoctorNotes('');
    setCurrentOrderId(null);
  };

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
            <li className="active"><Link to="/lab">المختبر</Link></li>
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
            <h2>{currentOrderId ? `تعديل طلب تحاليل (#${currentOrderId})` : "طلب تحاليل طبية وأشعة"}</h2>
          </div>
          <div className="header-left">
            <button className="history-btn" onClick={() => fetchLabOrder(5)} style={{padding: '6px 12px', cursor: 'pointer'}}>
              جلب طلب سابق 🕒
            </button>
          </div>
        </header>

        <div className="lab-content-area">
          
          {/* بطاقة معلومات المريض العلوية */}
          <div className="patient-summary-card">
            <div className="patient-details-right">
              <img src="/logo.png" alt="Patient" className="patient-avatar" />
              <div className="patient-info-text">
                <h3>أحمد محمد عبدالله</h3>
                <div className="patient-meta-info">
                  <span>رقم الملف: #10429</span>
                  <span>العمر: 45 سنة</span>
                  <span>ذكر</span>
                </div>
              </div>
            </div>
            <div className="patient-details-left">
              <span className="status-badge stable">حالة مستقرة</span>
              <span className="visit-date">تاريخ الزيارة: 24 أكتوبر 2023</span>
            </div>
          </div>

          <div className="section-title-container">
            <h3>تحديد الفحوصات المطلوبة</h3>
            <p>يرجى تحديد التحاليل المخبرية والأشعة المطلوبة للمريض.</p>
          </div>

          {/* شبكة الفحوصات (عمودين) */}
          <div className="lab-tests-grid">
            
            {/* العمود الأيمن: التحاليل المخبرية */}
            <div className="tests-column">
              <h4 className="column-title">🔬 التحاليل المخبرية</h4>
              
              {/* قسم تحاليل الدم */}
              <div className="test-category-card">
                <h5 className="category-title">تحاليل الدم (Blood Tests)</h5>
                
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>صورة دم كاملة (CBC)</span>
                    <small>Complete Blood Count</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Complete Blood Count (CBC)")}
                    onChange={() => handleCheckboxChange("Complete Blood Count (CBC)")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>مستوى السكر التراكمي (HbA1c)</span>
                    <small>Hemoglobin A1c</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("HbA1c")}
                    onChange={() => handleCheckboxChange("HbA1c")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>تحليل الدهون (Lipid Profile)</span>
                    <small>Cholesterol, Triglycerides, HDL, LDL</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Lipid Profile")}
                    onChange={() => handleCheckboxChange("Lipid Profile")}
                  />
                </label>
              </div>

              {/* قسم وظائف الأعضاء */}
              <div className="test-category-card">
                <h5 className="category-title">وظائف الأعضاء (Organ Function)</h5>
                
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>وظائف الكلى (KFT)</span>
                    <small>Kidney Function Test</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Kidney Function Test (KFT)")}
                    onChange={() => handleCheckboxChange("Kidney Function Test (KFT)")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>وظائف الكبد (LFT)</span>
                    <small>Liver Function Test</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Liver Function Test (LFT)")}
                    onChange={() => handleCheckboxChange("Liver Function Test (LFT)")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>تحليل البول (Urinalysis)</span>
                    <small>Routine & Microscopy</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Urinalysis")}
                    onChange={() => handleCheckboxChange("Urinalysis")}
                  />
                </label>
              </div>
            </div>

            {/* العمود الأيسر: الأشعة والتصوير */}
            <div className="tests-column">
              <h4 className="column-title">🩻 الأشعة والتصوير</h4>
              
              <div className="test-category-card">
                <h5 className="category-title">التصوير الطبي (Imaging)</h5>
                
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>أشعة سينية للصدر (Chest X-Ray)</span>
                    <small>PA View</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Chest X-Ray (Chest X-Ray)")}
                    onChange={() => handleCheckboxChange("Chest X-Ray (Chest X-Ray)")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>موجات صوتية على البطن (Abdominal Ultrasound)</span>
                    <small>Whole Abdomen</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("Abdominal Ultrasound")}
                    onChange={() => handleCheckboxChange("Abdominal Ultrasound")}
                  />
                </label>

                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>رنين مغناطيسي (MRI)</span>
                    <small>Specify area in notes</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedTests.includes("MRI")}
                    onChange={() => handleCheckboxChange("MRI")}
                  />
                </label>
              </div>

              {/* ملاحظات سريرية */}
              <div className="clinical-notes-card">
                <h5 className="category-title">ملاحظات سريرية للمختبر/الأشعة</h5>
                <textarea 
                  placeholder="أضف أي تفاصيل، تشخيص مبدئي، أو تعليمات خاصة هنا..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                ></textarea>
              </div>

            </div>

          </div>

          {/* أزرار الإرسال والتحديث */}
          <div className="lab-action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {!currentOrderId ? (
              <button className="submit-lab-btn" onClick={handleStoreOrder} disabled={isLoading}>
                {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب ➔'}
              </button>
            ) : (
              <button className="submit-lab-btn" onClick={handleUpdateOrder} disabled={isLoading} style={{backgroundColor: '#28a745'}}>
                {isLoading ? 'جاري التعديل...' : '✏️ تحديث الطلب'}
              </button>
            )}
            
            <button className="cancel-lab-btn" onClick={handleReset} style={{backgroundColor: '#6c757d', color: 'white'}}>
              إلغاء / طلب جديد
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default LabRequest;