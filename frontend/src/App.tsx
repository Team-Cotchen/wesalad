import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Creation from 'pages/Creation/Creation';

const Detail = lazy(() => import('pages/Detail/Detail'));
const Main = lazy(() => import('pages/Main/index'));
const Edit = lazy(() => import('pages/Edit/Edit'));
const GoogleLogin = lazy(() => import('pages/auth/googleLogin'));
const Setting = lazy(() => import('pages/Setting/Setting'));
const MyPosts = lazy(() => import('pages/MyPosts/MyPosts'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="project/:id" element={<Detail />} />
          <Route path="/creation" element={<Creation />} />
          <Route path="edit/:id" element={<Edit />} />
          <Route path="google/callback" element={<GoogleLogin />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="myposts" element={<MyPosts />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
