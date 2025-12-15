import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AlertContainer from './components/AlertContainer';
import './App.css';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import Contacts from './pages/Contacts';
import ErrorMessage from './pages/ErrorMessage';
import Settings from './pages/Settings';
import SupportInfo from './pages/SupportInfo';

const App = () => {
  return (
    <div className="app">
      <AlertContainer />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/write" element={<WriteBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<SupportInfo />} />
          
          <Route path="*" element={<ErrorMessage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
