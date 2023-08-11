import React from 'react';
import { MapPage } from './pages/map-page';
import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/landing-page';

function App() {
  return (
    <div>
      <Routes>
        <Route path="map" element={<MapPage />} />
        <Route path="" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
