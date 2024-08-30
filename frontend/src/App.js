import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login/login';
import SignUp from './pages/SignUp/signUp';
import Header from './components/header/header';
import Home from './pages/Home/home';
import Events from './pages/Events/events';
import EventDetail from './pages/EventDetail/eventDetail';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/events/detail/:eventId" element={<EventDetail />} />
        <Route path="/events/:eventTypeId" element={<Events />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
