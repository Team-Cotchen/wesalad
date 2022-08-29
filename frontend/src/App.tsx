import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creation from 'pages/Creation/Creation';
import Detail from 'pages/Detail/Detail';
import Main from 'pages/Main/index';
import Edit from 'pages/Edit/Edit';
import GoogleLogin from 'pages/auth/googleLogin';
import Setting from 'pages/Setting/Setting';
import MyPosts from 'pages/MyPosts/MyPosts';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="project/:id" element={<Detail />} />
        <Route path="/creation" element={<Creation />} />
        <Route path="edit/:id" element={<Edit />} />
        <Route path="google/callback" element={<GoogleLogin />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="myposts" element={<MyPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
