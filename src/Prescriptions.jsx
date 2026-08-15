import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Prescriptions.css';

function Prescriptions() {
  const params = useParams();
  const appointmentId = params.appointmentId || 4;

  // 1. إدارة الحالة (State)
  const [items, setItems] = useState([
    { id: Date.now(), medicine_name: 'Amoxicillin 500mg', dosage: 'كبسولة واحدة', frequency: '3 مرات يومياً', duration: '7' },
  ]);
  const [instructions, setInstructions] = useState('');
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // إعدادات الـ API
  const BASE_URL = 'https://api-shayyah.abukm.com/api'; 
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  // إضافة سطر دواء جديد
  const addNewItemRow = () => {
    const newItem = { id: Date.now(), medicine_name: '', dosage: '', frequency: '', duration: '' };
    setItems([...items, newItem]);
  };

  // تحديث حقول الدواء
  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // تجهيز الـ Payload المشترك
  const getPayload = () => {
    const validItems = items
      .filter(item => item.medicine_name.trim() !== '')
      .map(item => ({
        medicine_name: item.medicine_name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration
      }));

    if (validItems.length === 0) {
      alert("يرجى إضافة دواء واحد على الأقل.");
      return null;
    }

    return {
      instructions: instructions,
      items: validItems
    };
  };

  // أ. إنشاء وصفة جديدة (POST)
  const handleCreate = async () => {
    const payload = getPayload();
    if (!payload) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/appointments/${appointmentId}/prescription`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("تم حفظ الروشتة بنجاح!");
        // إذا كان السيرفر يعيد بيانات الوصفة أو الـ id، نقوم بتخزينه ليتحول الزر تلقائياً إلى "تعديل"
        if (data.id || data.prescription?.id) {
          setCurrentPrescriptionId(data.id || data.prescription.id);
        }
      } 
      else if (response.status === 422) {
        let errorMessage = "يوجد خطأ في البيانات المدخلة:\n";
        if (data.errors) {
            for (const key in data.errors) {
                errorMessage += `- ${data.errors[key][0]}\n`;
            }
        } else {
            errorMessage += data.message || "تأكد من تعبئة جميع الحقول.";
        }
        alert(errorMessage);
      } 
      else {
        alert("حدث خطأ أثناء الحفظ");
        console.error("Server Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  // ب. تحديث وصفة موجودة (PUT)
  const handleUpdate = async () => {
    const payload = getPayload();
    if (!payload) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/prescriptions/${currentPrescriptionId}/update`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("تم تحديث الروشتة بنجاح!");
      } else {
        alert("حدث خطأ أثناء التحديث");
        console.error("Update Error:", data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  // ج. جلب وصفة سابقة (GET)
  const fetchPrescription = async (prescriptionId) => {
    try {
      const response = await fetch(`${BASE_URL}/prescriptions/${prescriptionId}/show`, {
        method: 'GET',
        headers: headers
      });
      const data = await response.json();
      if (response.ok) {
        const fetchedItems = data.items.map(item => ({ ...item, id: Math.random() }));
        setItems(fetchedItems);
        setInstructions(data.instructions || '');
        setCurrentPrescriptionId(prescriptionId);
      } else {
         alert("لم يتم العثور على الوصفة");
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  // د. حذف وصفة (DELETE)
  const handleDelete = async () => {
    if (!currentPrescriptionId) return;
    
    if(window.confirm("هل أنت متأكد من حذف هذه الروشتة؟")) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/prescriptions/${currentPrescriptionId}/delete`, {
          method: 'DELETE',
          headers: headers
        });
        if (response.ok) {
          alert("تم الحذف بنجاح");
          setItems([{ id: Date.now(), medicine_name: '', dosage: '', frequency: '', duration: '' }]);
          setInstructions('');
          setCurrentPrescriptionId(null);
        } else {
          alert("حدث خطأ أثناء الحذف");
        }
      } catch (error) {
        console.error("Error deleting:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // هـ. زر إلغاء أو تفريغ النموذج لإنشاء روشتة جديدة
  const handleReset = () => {
    setCurrentPrescriptionId(null);
    setItems([{ id: Date.now(), medicine_name: '', dosage: '', frequency: '', duration: '' }]);
    setInstructions('');
  };

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
            <li><Link to="/patient-history">المرضى</Link></li>
            <li><Link to="/records">السجل الطبي</Link></li>
            <li className="active"><Link to="/prescriptions">الوصفات</Link></li>
            <li><Link to="/lab">المختبر</Link></li>
            <li><Link to="/messages">الرسائل</Link></li>
            <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content background-gray">
        <div className="prescription-header-container">
          <div className="title-and-patient">
            <h1>{currentPrescriptionId ? "تعديل وصفة طبية" : "إنشاء وصفة طبية"}</h1>
            <p>رقم الموعد الحالي: {appointmentId}</p>
          </div>
          <button className="history-btn" onClick={() => fetchPrescription(4)}>
             السجل السابق (تجربة ID: 4) 🕒
          </button>
        </div>

        <div className="prescription-content-area">
          <div className="prescription-paper">
            <div className="doctor-header">
              <div className="doctor-info">
                <h2>اسم الدكتور  :</h2>
                <p>   التخصص </p>
              </div>
              <div className="clinic-stamp">
                 <img src="/logo.png" alt="Logo" className="small-logo" />
              </div>
              <div className="prescription-meta">
                <p>التاريخ: </p>
                <p>رقم الوصفة: {currentPrescriptionId ? `#RX-${currentPrescriptionId}` : 'جديدة'}</p>
              </div>
            </div>

            <div className="medications-section">
              <h3 className="section-title">الأدوية الموصوفة 💊</h3>
              
              {items.map((item) => (
                <div className="medication-row" key={item.id}>
                  <div className="form-group med-name">
                    <label>اسم الدواء</label>
                    <input 
                      type="text" 
                      placeholder="اكتب اسم الدواء..." 
                      value={item.medicine_name} 
                      onChange={(e) => handleItemChange(item.id, 'medicine_name', e.target.value)}
                    />
                  </div>
                  <div className="form-group med-dose">
                    <label>الجرعة</label>
                    <input 
                      type="text" 
                      placeholder="مثال: حبة واحدة" 
                      value={item.dosage} 
                      onChange={(e) => handleItemChange(item.id, 'dosage', e.target.value)}
                    />
                  </div>
                  <div className="form-group med-freq">
                    <label>التكرار</label>
                    <input 
                      type="text"
                      placeholder="مثال: مرتين يومياً"
                      value={item.frequency}
                      onChange={(e) => handleItemChange(item.id, 'frequency', e.target.value)}
                    />
                  </div>
                  <div className="form-group med-duration">
                    <label>المدة</label>
                    <div className="duration-input">
                      <input 
                        type="text" 
                        placeholder="مثال: لمدة 7 أيام"
                        value={item.duration} 
                        onChange={(e) => handleItemChange(item.id, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button className="add-med-btn" onClick={addNewItemRow}>
                + إضافة دواء جديد
              </button>
            </div>

            <div className="notes-section">
              <label>تعليمات وملاحظات إضافية للمريض (تطبع على الروشتة)</label>
              <textarea 
                placeholder="مثال: تؤخذ الأدوية بعد الطعام والالتزام بالجرعات..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* الأزرار المعدلة: حفظ جديد، تعديل، حذف، وإلغاء */}
          <div className="action-buttons-container" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {!currentPrescriptionId ? (
              <button className="save-print-btn" onClick={handleCreate} disabled={isLoading} style={{backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer'}}>
                {isLoading ? 'جاري الحفظ...' : '💾 حفظ روشتة جديدة'}
              </button>
            ) : (
              <>
                <button className="update-btn" onClick={handleUpdate} disabled={isLoading} style={{backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer'}}>
                  {isLoading ? 'جاري التعديل...' : '✏️ تعديل الروشتة'}
                </button>
                <button className="delete-btn" onClick={handleDelete} disabled={isLoading} style={{backgroundColor: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer'}}>
                  🗑️ حذف الروشتة
                </button>
              </>
            )}
            
            <button className="cancel-btn" onClick={handleReset} style={{backgroundColor: '#6c757d', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer'}}>
              إلغاء / روشتة جديدة
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Prescriptions;