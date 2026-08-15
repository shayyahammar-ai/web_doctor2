import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Appointments from './Appointments';
import PatientHistory from './PatientHistory';
import MedicalRecords from './MedicalRecords';
import Prescriptions from './Prescriptions';
import LabRequest from './LabRequest';
import Messages from './Messages';
import Profile from './Profile';
import { requestPermissionAndGetToken, onForegroundMessage } from './firebase'; // استيراد دوال الفايربيس للإشعارات
import './App.css';

function App() {
  useEffect(() => {
    // طلب الإذن وجلب التوكن عند أول تحميل للتطبيق
    requestPermissionAndGetToken();

    // تشغيل مستمع الإشعارات والتطبيق مفتوح
    onForegroundMessage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patient-history" element={<PatientHistory />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/lab" element={<LabRequest />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;