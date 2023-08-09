import React, { useEffect, useState } from 'react';
import Map, { Marker, ViewState, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useWindowSize } from '../../common/hooks/useWindowSize';
import axios from 'axios';
import { Slot } from './Slot';

interface Props { }

const initialViewport: Partial<ViewState> = {
  latitude: 32.07251,
  longitude: 34.77915,
  zoom: 16
}


export const MapPage: React.FC<Props> = (props: Props) => {
  const [viewport, setViewport] = useState<Partial<ViewState>>(initialViewport);
  const { width, height } = useWindowSize();
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data } = await axios.get('http://localhost:8080/heatmap');
      const points = data.points as Point[];
      setPoints(points);
    }

    init();
  });

  return (
    <div>
      <Map
        {...viewport}
        style={{ width, height }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(evt: ViewStateChangeEvent) => setViewport(evt.viewState)}
      >
        {points.map((point) => (
          <Marker
            key={getPointKey(point)}
            latitude={point.location.latitude}
            longitude={point.location.longitude}
          >
            <Slot point={point}/>
          </Marker>
        ))}
      </Map>
    </div>
  );
}

export interface Point {
  location: {
    latitude: number;
    longitude: number;
  }
  value: number;
}

function getPointKey(p: Point): string {
  return `${p.location.latitude},${p.location.longitude}`;
}