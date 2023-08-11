import React from 'react';
import { MapPage } from './pages/map-page';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<MapPage />} />
      </Routes>
    </div>
  );
}

export default App;
