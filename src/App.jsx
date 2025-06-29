// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Solution from './pages/Solution';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminUpload from './pages/AdminUpload'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation bar */}
        <Navbar />
        
        {/* Main content area with routes */}
        <main className="flex-grow container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />   
            <Route path="/chapters/:subjectId" element={<Chapters />} />
            <Route path="/quiz/:chapterId" element={<Quiz />} />
            <Route path="/result/:chapterId" element={<Result />} />
            <Route path="/solution/:chapterId" element={<Solution />} />
            {/* <Route path="/admin/upload"element={JSON.parse(localStorage.getItem("currentUser"))?.role === "admin" ? (<AdminUpload />) : (<Navigate to="/" />)}/> */}
            <Route path="/admin/upload" element={<AdminUpload />} />

          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
