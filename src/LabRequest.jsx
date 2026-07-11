import React from 'react';
import { Link } from 'react-router-dom';
import './LabRequest.css';

function LabRequest() {
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
            <h2>طلب تحاليل طبية وأشعة</h2>
          </div>
          <div className="header-left">
            <div className="search-box">
              <input type="text" placeholder="البحث عن مريض..." />
            </div>
            {/* أيقونات التنبيهات والملف الشخصي يمكن إضافتها هنا */}
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
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>مستوى السكر التراكمي (HbA1c)</span>
                    <small>Hemoglobin A1c</small>
                  </div>
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>تحليل الدهون (Lipid Profile)</span>
                    <small>Cholesterol, Triglycerides, HDL, LDL</small>
                  </div>
                  <input type="checkbox" />
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
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>وظائف الكبد (LFT)</span>
                    <small>Liver Function Test</small>
                  </div>
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>تحليل البول (Urinalysis)</span>
                    <small>Routine & Microscopy</small>
                  </div>
                  <input type="checkbox" />
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
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>موجات صوتية على البطن (Abdominal Ultrasound)</span>
                    <small>Whole Abdomen</small>
                  </div>
                  <input type="checkbox" />
                </label>
                <label className="test-checkbox-item">
                  <div className="test-name">
                    <span>رنين مغناطيسي (MRI)</span>
                    <small>Specify area in notes</small>
                  </div>
                  <input type="checkbox" />
                </label>
              </div>

              {/* ملاحظات سريرية وأولوية الطلب */}
              <div className="clinical-notes-card">
                <h5 className="category-title">ملاحظات سريرية للمختبر/الأشعة</h5>
                <textarea placeholder="أضف أي تفاصيل، تشخيص مبدئي، أو تعليمات خاصة هنا..."></textarea>
                
                <div className="priority-section">
                  <strong>أولوية الطلب</strong>
                  <div className="radio-group">
                    <label className="radio-item normal-priority">
                      <input type="radio" name="priority" defaultChecked />
                      عادي (Normal)
                    </label>
                    <label className="radio-item urgent-priority">
                      <input type="radio" name="priority" />
                      عاجل (Urgent)
                    </label>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* أزرار الإرسال والإلغاء */}
          <div className="lab-action-buttons">
            <button className="submit-lab-btn">إرسال الطلب ➔</button>
            <button className="cancel-lab-btn">إلغاء الطلب</button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default LabRequest;