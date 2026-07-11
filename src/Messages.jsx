import React from 'react';
import { Link } from 'react-router-dom';
import './Messages.css';

function Messages() {
  // بيانات وهمية لقائمة المحادثات
  const contactsList = [
    { id: 1, name: 'أحمد محمود', type: 'مريض', time: 'الآن', unread: 2, isActive: true, avatar: '👨🏻‍🦱', lastMsg: 'هل يمكنني تغيير موعد الجرعة ال...' },
    { id: 2, name: 'ممرضة سارة (طاقم)', type: 'طاقم طبي', time: '10:42 ص', unread: 0, isActive: false, avatar: '👩🏻‍⚕️', lastMsg: 'تم تحديث ملف المريض في الغرفة 3.' },
    { id: 3, name: 'خالد العتيبي', type: 'مريض', time: 'أمس', unread: 0, isActive: false, avatar: 'خ', lastMsg: 'شكراً لك دكتور. سأقوم بإجراء التحاليل...' },
  ];

  // بيانات وهمية للمحادثة النشطة
  const currentChat = [
    { id: 1, sender: 'them', text: 'السلام عليكم دكتور. كيف حالك؟', time: '09:15 ص', avatar: '👨🏻‍🦱' },
    { id: 2, sender: 'them', text: 'هل يمكنني تغيير موعد الجرعة القادمة من الدواء لأنني أشعر ببعض الغثيان في الصباح؟', time: '09:16 ص', avatar: '👨🏻‍🦱' },
    { id: 3, sender: 'me', text: 'وعليكم السلام أستاذ أحمد. لا بأس، هذا عرض جانبي متوقع.', time: '09:45 ص', avatar: '👨🏻‍⚕️' },
    { id: 4, sender: 'me', text: 'يمكنك تأخير الجرعة لتكون بعد الغداء بدلاً من الصباح. هل يناسبك ذلك؟', time: '09:45 ص', avatar: '👨🏻‍⚕️' },
    { id: 5, sender: 'them', text: 'ممتاز. سأفعل ذلك. شكراً جزيلاً دكتور.', time: 'الآن', avatar: '👨🏻‍🦱' },
  ];

  return (
    <div className="dashboard-layout" dir="rtl">
      
      {/* القائمة الجانبية الرئيسية للعيادة */}
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
            <li className="active"><Link to="/messages">الرسائل</Link></li>
           <li><Link to="/profile">الملف الشخصي</Link></li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي (واجهة الرسائل) */}
      <main className="main-content chat-main-wrapper">
        
        {/* الترويسة العليا للرسائل */}
        <header className="top-header chat-global-header">
          <div className="header-right">
            <h2>الرسائل</h2>
          </div>
          <div className="header-left">
            <div className="search-box">
              <input type="text" placeholder="بحث عام..." />
            </div>
            <div className="header-icons">
               <span className="bell-icon">🔔</span>
               <img src="/logo.png" alt="Doctor" className="header-avatar" />
            </div>
          </div>
        </header>

        {/* حاوية تطبيق الرسائل */}
        <div className="messages-app-container">
          
          {/* القائمة الجانبية للمحادثات (الوسطى) */}
          <div className="contacts-sidebar">
            <div className="contacts-search">
              <input type="text" placeholder="البحث في جهات الاتصال..." />
            </div>
            <div className="contacts-filters">
              <button className="filter-btn active">الكل</button>
              <button className="filter-btn">المرضى</button>
              <button className="filter-btn">الطاقم الطبي</button>
            </div>
            <div className="contacts-list">
              {contactsList.map(contact => (
                <div className={`contact-item ${contact.isActive ? 'active-chat' : ''}`} key={contact.id}>
                  <div className="contact-avatar-wrapper">
                    {contact.avatar.length > 2 ? (
                      <span className="emoji-avatar">{contact.avatar}</span>
                    ) : (
                      <div className="text-avatar">{contact.avatar}</div>
                    )}
                    {contact.isActive && <div className="online-dot-small"></div>}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name-time">
                      <h4>{contact.name}</h4>
                      <span className="msg-time">{contact.time}</span>
                    </div>
                    <div className="contact-last-msg">
                      <p>{contact.lastMsg}</p>
                      {contact.unread > 0 && <span className="unread-badge">{contact.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* نافذة المحادثة المفتوحة (اليسرى) */}
          <div className="chat-window">
            
            {/* ترويسة المحادثة */}
            <div className="chat-header">
              <div className="chat-user-info">
                <span className="emoji-avatar large-avatar">👨🏻‍🦱</span>
                <div>
                  <h3>أحمد محمود</h3>
                  <span className="online-status"><span className="dot"></span> متصل الآن</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-icon">📞</button>
                <button className="action-icon">🎥</button>
                <button className="action-icon">⋮</button>
              </div>
            </div>

            {/* مساحة عرض الرسائل */}
            <div className="chat-messages-area">
              <div className="date-divider">
                <span>اليوم</span>
              </div>
              
              {currentChat.map(msg => (
                <div className={`message-wrapper ${msg.sender === 'me' ? 'msg-me' : 'msg-them'}`} key={msg.id}>
                  {msg.sender === 'them' && <span className="msg-avatar">{msg.avatar}</span>}
                  
                  <div className="message-content">
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                    </div>
                    <span className="message-time">
                      {msg.sender === 'me' && <span className="read-tick">✔️✔️</span>} {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'me' && <span className="msg-avatar">{msg.avatar}</span>}
                </div>
              ))}
            </div>

            {/* مربع كتابة الرسالة */}
            <div className="chat-input-area">
              <button className="icon-btn attachment-btn">📎</button>
              <input type="text" placeholder="اكتب رسالة..." />
              <button className="icon-btn emoji-btn">😊</button>
              <button className="send-btn">➤</button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Messages;