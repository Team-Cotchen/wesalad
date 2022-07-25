import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Detail from 'pages/Detail/Detail';
import Main from 'pages/Main/index';
import Creation from 'pages/Creation/Creation';
import Edit from 'pages/Edit/Edit';
import GoogleLogin from 'pages/auth/googleLogin';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="project/:id" element={<Detail />} />
        <Route path="/creation" element={<Creation />} />
        <Route path="edit/:id" element={<Edit />} />
        <Route path="/callback" element={<GoogleLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
