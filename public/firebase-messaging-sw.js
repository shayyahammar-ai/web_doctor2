// استيراد سكربتات فايبربيس للإصدار المعتمد
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// إعدادات مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyDcHuWqYmCn9DQLY5FQoE5nw2un5-eoy98",
  authDomain: "clinco-12950.firebaseapp.com",
  projectId: "clinco-12950",
  storageBucket: "clinco-12950.firebasestorage.app",
  messagingSenderId: "759191366726",
  appId: "1:759191366726:web:50e2dc40d6db45c0e1ee47",
  measurementId: "G-R6ZSSJGR6E"
};

// 1. تهيئة فايبربيس أولاً
firebase.initializeApp(firebaseConfig);

// 2. جلب خدمة المراسلة
const messaging = firebase.messaging();

// 3. التعامل مع الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('استلام إشعار في الخلفية:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});