import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard'; // سنقوم بإنشاء هذا الملف الآن
import Appointments from './Appointments'; // استيراد الصفحة الجديدة
import PatientHistory from './PatientHistory'; // 1. استيراد الواجهة الجديدة
import MedicalRecords from './MedicalRecords'; // 1. استيراد واجهة السجل الطبي
import Prescriptions from './Prescriptions'; // 1. استيراد واجهة الوصفات
import LabRequest from './LabRequest'; // 1. استيراد واجهة المختبر
import Messages from './Messages'; // 1. استيراد واجهة الرسائل
import Profile from './Profile'; // 1. استيراد واجهة الملف الشخصي
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} /> {/* المسار الجديد */}
        <Route path="/patient-history" element={<PatientHistory />} /> {/* 2. المسار الجديد */}
        <Route path="/records" element={<MedicalRecords />} /> {/* 2. المسار الجديد */}
        <Route path="/prescriptions" element={<Prescriptions />} /> {/* 2. المسار الجديد */}
        <Route path="/lab" element={<LabRequest />} /> {/* 2. المسار الجديد */}
        <Route path="/messages" element={<Messages />} /> {/* 2. المسار الجديد */}
        <Route path="/profile" element={<Profile />} /> {/* 2. المسار الجديد */}
      </Routes>
    </Router>
  );
}

export default App;