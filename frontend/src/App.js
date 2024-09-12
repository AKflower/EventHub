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
import { UserProvider, useUserContext} from './context/UserContext'
import Booking from './pages/Booking/booking';
import Payment from './pages/Payment/payment';
import Cart from './pages/Cart/cart';
import Profile from './pages/Profile/profile';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Header />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/events/detail/:eventId" element={<EventDetail />} />
        <Route path="/events/:category" element={<Events />} />
        <Route path='/booking/:bookingId' element={<Booking />}/>
        <Route path='/booking/:bookingId/payment' element={<Payment />}/>
        <Route path='/booking/:bookingId/payment-success' element={<Payment status={1}/>}/>
        <Route path='/my-tickets' element={<Cart />}/>
        <Route path='/profile' element={<Profile />}/>



      </Routes>
      <ToastContainer />
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;
