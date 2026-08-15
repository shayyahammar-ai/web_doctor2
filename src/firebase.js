import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDcHuWqYmCn9DQLY5FQoE5nw2un5-eoy98",
  authDomain: "clinco-12950.firebaseapp.com",
  projectId: "clinco-12950",
  storageBucket: "clinco-12950.firebasestorage.app",
  messagingSenderId: "759191366726",
  appId: "1:759191366726:web:50e2dc40d6db45c0e1ee47",
  measurementId: "G-R6ZSSJGR6E"
};

// تهيئة تطبيق فايبربيس
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// دالة لطلب إذن الإشعارات والحصول على الـ FCM Token
export const requestPermissionAndGetToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, {
        vapidKey: "BNgf_dgItdp4hBzteaTZMQ7woHsuP6eGxzXUbMi3QMqsQvpwqOHms-C4OUdlJoM5dzkpQ4pXSlj2DHs3ncenZ00"
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // هنا يمكنك إرسال هذا الـ Token إلى سيرفر Laravel لحفظه في قاعدة البيانات وربطه بالطبيب
        return currentToken;
      } else {
        console.log("لم يتم العثور على Token للإشعارات.");
      }
    } else {
      console.log("تم رفض إذن الإشعارات.");
    }
  } catch (error) {
    console.error("خطأ أثناء طلب إذن الإشعارات:", error);
  }
};

// استقبال الإشعارات عندما يكون التطبيق مفتوحاً (Foreground)
export const onForegroundMessage = () => {
  onMessage(messaging, (payload) => {
    console.log("تم استلام إشعار والتطبيق مفتوح:", payload);
    alert(`إشعار جديد: ${payload.notification.title} - ${payload.notification.body}`);
  });
};