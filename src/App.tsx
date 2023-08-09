import React from 'react';
import { MapPage } from './pages/map-page';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

function App() {
  return (
    <MapPage />
  );
}

export default App;
