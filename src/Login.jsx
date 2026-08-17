import React, { useState } from 'react';
import axios from 'axios'; // استيراد axios للربط
import { useNavigate } from 'react-router-dom'; // <-- 1. السطر الناقص الأول هنا
import './Login.css';

function Login() {
     const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
const navigate = useNavigate(); // <-- 2. السطر الناقص الثاني هنا
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // هنا نضع رابط الـ API الخاص ببشار
      const response = await axios.post('https://api-shayyah.abukm.com/api/login', formData);
      
      console.log("تم بنجاح:", response.data);
     const token = response.data.Token || response.data.access_token || response.data.data?.token || response.data.authorisation?.token;

      if (token) {
        // 2. حفظ التوكن في ذاكرة المتصفح
        localStorage.setItem('token', token);
        alert("أهلاً بك يا دكتور!");
        navigate('/dashboard');
      } else {
        console.error("لم يتم العثور على token في استجابة السيرفر:", response.data);
        alert("حدث خطأ في استلام مفتاح الدخول (Token)");
      }

    } catch (err) {
      console.error(err);
      alert("البريد أو كلمة المرور غير صحيحة");
      setError("البريد أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* الصورة من مجلد public */}
        <img src="/logo.png" alt="Clinico Logo" className="logo" />
        
        <h2>عيادة </h2>
        <p className="subtitle">تسجيل الدخول إلى لوحة التحكم</p>

  <form onSubmit={handleSubmit}>
  <label>اسم المستخدم / البريد الإلكتروني</label>
  <input 
    type="text" 
    placeholder="أدخل اسم المستخدم" 
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
  />

          <label>كلمة المرور</label>
          <input 
            type="password" 
            placeholder="********" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <div className="form-footer">
            <label><input type="checkbox" /> تذكرني</label>
            <a href="#">نسيت كلمة المرور؟</a>
          </div>

          <button type="submit">تسجيل الدخول →</button>
        </form>
        
        <p className="footer-text">نظام إدارة العيادة الطبي المعتمد</p>
      </div>
    </div>
  );
}

export default Login;


//finish.