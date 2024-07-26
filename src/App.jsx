import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdmissionForm from './components/AdmissionForm';
import FeeForm from './components/FeeForm';
import ResultForm from './components/ResultForm';
import StudentList from './components/StudentList';
import FeeList from './components/FeeList';
import ResultList from './components/ResultList';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path="/admin" element={
          <ProtectedRouteForAdmin>
          <AdminDashboard/>
          </ProtectedRouteForAdmin>
           } />
        <Route path="/admission" element={
          <ProtectedRouteForAdmin>
          <AdmissionForm />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/students" element={
          <ProtectedRouteForAdmin>
          <StudentList />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/fee" element={
          <ProtectedRouteForAdmin>
          <FeeForm />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/fees" element={
          <ProtectedRouteForAdmin>
          <FeeList />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/results" element={
          <ProtectedRouteForAdmin>
          <ResultForm />
          </ProtectedRouteForAdmin>
          } />
        <Route path="/results-list" element={
          <ProtectedRouteForAdmin>
          <ResultList />
          </ProtectedRouteForAdmin>
          } />
      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;


export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('admin'))
  if (admin?.user?.email === "imtiazzohaib767@gmail.com") {
    return children
  }
  else {
    return <Navigate to={'/'} />
  }
}

