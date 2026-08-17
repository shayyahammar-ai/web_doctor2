import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token'); 
        
        const response = await axios.get('https://api-shayyah.abukm.com/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const notificationsArray = response.data.data.data;
        setNotifications(notificationsArray);
        setLoading(false);

      } catch (err) {
        console.error("حدث خطأ أثناء جلب الإشعارات:", err);
        setError("تعذر جلب الإشعارات، يرجى المحاولة لاحقاً.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // دالة مخصصة لتنسيق التاريخ والوقت (سنة-شهر-يوم | ساعة:دقيقة:ثانية)
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="notifications-page" dir="rtl">
      <div className="notifications-container">
        
        <header className="notifications-header">
          <h2>🔔 الإشعارات</h2>
          <Link to="/dashboard" className="back-btn">
             العودة للرئيسية ➔
          </Link>
        </header>

        {loading && <div className="loading-text">جاري تحميل الإشعارات...</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && notifications.length === 0 ? (
          <div className="empty-state">لا يوجد إشعارات حالياً.</div>
        ) : (
          <div className="notifications-list">
            {notifications.map((note) => (
              <div key={note.id} className="notification-card">
                <div className="notification-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                
                <div className="notification-content">
                  <h4 className="notification-title">{note.title}</h4>
                  <p className="notification-body">{note.body}</p>
                </div>

                {/* قسم عرض التاريخ والوقت الجديد */}
                <div className="notification-time" dir="ltr">
                  <span>{formatDateTime(note.created_at)}</span>
<svg style={{ marginLeft: '8px' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;