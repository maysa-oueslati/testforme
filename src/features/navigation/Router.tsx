import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ActivityMenu from '../activity/ActivityMenu';
import Editor from '../editor/Editor';
import Player from '../player/Player';
import Dashboard from '../dashboard/Dashboard';
import Home from '../home/Home';
import Activity from '../activity/Activity';
import Login from '../login/Login';
import useStore from '../../app/store';

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = tokenString ? JSON.parse(tokenString) : null;
  return userToken.email;
}

export default function Router() {
  const userEmail = useStore((state) => state.authSlice.userEmail);

  if (!userEmail) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/about'
          element={<About />}
        />
        <Route
          path='/edit-activity'
          element={<Editor />}
        />
        <Route
          path='/view-activity/:id'
          element={<Activity />}
        />
        <Route
          path='/play-activity'
          element={<Player />}
        />
        <Route
          path='/dashboard'
          element={<Dashboard />}
        />
        <Route
          path='/library'
          element={<Home />}
        />
        <Route
          path='/'
          element={<Home />}
        />
      </Routes>

      <ActivityMenu />
    </BrowserRouter>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}
