import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Prescriptions.css';

function Prescriptions() {
  // استخدام State لإدارة قائمة الأدوية (نبدأ بدواء واحد معبأ وواحد فارغ كما في صورتك)
  const [medications, setMedications] = useState([
    { id: 1, name: 'Amoxicillin 500mg', dose: 'كبسولة واحدة', frequency: '3 مرات يومياً', duration: '7' },
    { id: 2, name: '', dose: '', frequency: '', duration: '' }
  ]);

  // دالة لإضافة سطر دواء جديد عند الضغط على الزر
  const addNewMedicationRow = () => {
    const newMed = { id: Date.now(), name: '', dose: '', frequency: '', duration: '' };
    setMedications([...medications, newMed]);
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
            <li className="active"><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
            <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content background-gray">
        
        {/* الترويسة العليا ومعلومات المريض */}
        <div className="prescription-header-container">
          <div className="title-and-patient">
            <h1>إنشاء وصفة طبية</h1>
            <p>مريض: أحمد محمد عبدالله | رقم الملف: 84920</p>
          </div>
          <button className="history-btn">
             السجل السابق 🕒
          </button>
        </div>

        <div className="prescription-content-area">
          {/* ورقة الوصفة الطبية (الروشتة) */}
          <div className="prescription-paper">
            
            {/* ترويسة الطبيب */}
            <div className="doctor-header">
              <div className="doctor-info">
                <h2>د. خالد عبدالرحمن</h2>
                <p>استشاري أمراض القلب والباطنة</p>
              </div>
              <div className="clinic-stamp">
                 <img src="/logo.png" alt="Logo" className="small-logo" />
              </div>
              <div className="prescription-meta">
                <p>التاريخ: 15 مايو 2024</p>
                <p>رقم الوصفة: #RX-2938</p>
              </div>
            </div>

            {/* قسم الأدوية */}
            <div className="medications-section">
              <h3 className="section-title">الأدوية الموصوفة 💊</h3>
              
              {/* رسم سطور الأدوية بناءً على الـ State */}
              {medications.map((med, index) => (
                <div className="medication-row" key={med.id}>
                  <div className="form-group med-name">
                    <label>اسم الدواء</label>
                    <input type="text" placeholder="اكتب اسم الدواء..." defaultValue={med.name} />
                  </div>
                  <div className="form-group med-dose">
                    <label>الجرعة</label>
                    <input type="text" placeholder="مثال: حبة واحدة" defaultValue={med.dose} />
                  </div>
                  <div className="form-group med-freq">
                    <label>التكرار</label>
                    <select defaultValue={med.frequency}>
                      <option value="">اختر التكرار...</option>
                      <option value="مرة يومياً">مرة يومياً</option>
                      <option value="مرتين يومياً">مرتين يومياً</option>
                      <option value="3 مرات يومياً">3 مرات يومياً</option>
                    </select>
                  </div>
                  <div className="form-group med-duration">
                    <label>المدة</label>
                    <div className="duration-input">
                      <input type="number" defaultValue={med.duration} />
                      <span>أيام</span>
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-med-btn" onClick={addNewMedicationRow}>
                + إضافة دواء جديد
              </button>
            </div>

            {/* ملاحظات المريض */}
            <div className="notes-section">
              <label>ملاحظات إضافية للمريض (تطبع على الروشتة)</label>
              <textarea placeholder="مثال: يرجى المراجعة بعد أسبوع، وتجنب الأطعمة المالحة..."></textarea>
            </div>

          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="action-buttons-container">
            <button className="save-print-btn">🖨️ حفظ وطباعة الروشتة</button>
            <button className="cancel-btn">إلغاء</button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Prescriptions;