import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from "./components/landing_page/LandingPage";
import Login from "./components/login/Login";
import Registration from "./components/registration/Registration";
import './App.css';
import Navbar from "./components/navbar/Navbar";
import ProfilePage from "./components/profile_page/ProfilePage";

function App() {
  return (
    <div className="App">
      <Router>
          <Navbar/>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
