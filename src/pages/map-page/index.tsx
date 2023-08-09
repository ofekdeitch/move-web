import React, { useEffect, useState } from 'react';
import Map, { ViewState, ViewStateChangeEvent, } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useWindowSize } from '../../common/hooks/useWindowSize';
import axios from 'axios';
import { COLORS } from './Slot';
import { Length } from '../../common/hooks/useWindowSize/geo';
import { HeatmapLayer } from './HeatmapLayer';

const SLOT_SIZE = Length.meters(20);

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
        <HeatmapLayer key="red" color={COLORS.RED} points={points} range={{ min: 4, max: 10 }} slotSize={SLOT_SIZE} />
        <HeatmapLayer key="yellow" color={COLORS.YELLOW} points={points} range={{ min: 3, max: 3 }} slotSize={SLOT_SIZE} />
        <HeatmapLayer key="green" color={COLORS.GREEN} points={points} range={{ min: 0, max: 2 }} slotSize={SLOT_SIZE} />
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
