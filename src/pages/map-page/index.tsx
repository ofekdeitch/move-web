import React, { useCallback, useEffect, useState } from 'react';
import Map, { ViewState, ViewStateChangeEvent, } from 'react-map-gl';
import { useWindowSize } from '../../common/hooks/useWindowSize';
import axios from 'axios';
import { COLORS } from './Slot';
import { Length } from '../../common/hooks/useWindowSize/geo';
import { HeatmapLayer } from './HeatmapLayer';
import { config } from '../../common/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';

const SLOT_SIZE = Length.meters(20);

interface Props { }

const DEFAULT_VIEWPORT: Partial<ViewState> = {
  latitude: 32.07251,
  longitude: 34.77915,
  zoom: 16
}

export const MapPage: React.FC<Props> = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialViewport = parseViewport(searchParams)
  const [viewport, setViewport] = useState<Partial<ViewState>>(initialViewport);
  const { width, height } = useWindowSize();
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const init = async () => {
      const url = `${config.api.host}/heatmap`;
      const { data } = await axios.get(url);
      const points = data.points as Point[];
      setPoints(points);
    }

    init();
  }, []);

  const updateSeachParams = useCallback(_.throttle((
    nextViewport: Partial<ViewState>,
  ) => {
    const serialzied = serializeViewport(nextViewport);
    setSearchParams(serialzied, { replace: true });
  }, 500), [(setSearchParams)]);

  useEffect(() => {
    updateSeachParams(viewport);
  }, [updateSeachParams, viewport]);

  return (
    <div>
      <Map
        {...viewport}
        style={{ width, height }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMove={(evt: ViewStateChangeEvent) => setViewport(evt.viewState)}
      >
        <HeatmapLayer id="red" color={COLORS.RED} points={points} range={{ min: 4 }} slotSize={SLOT_SIZE} />
        <HeatmapLayer id="yellow" color={COLORS.YELLOW} points={points} range={{ min: 3, max: 3 }} slotSize={SLOT_SIZE} />
        <HeatmapLayer id="green" color={COLORS.GREEN} points={points} range={{ max: 2 }} slotSize={SLOT_SIZE} />
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

function parseViewport(searchParams: URLSearchParams): Partial<ViewState> {
  const latitude = tryParse(searchParams.get("latitude")) ?? DEFAULT_VIEWPORT.latitude;
  const longitude = tryParse(searchParams.get("longitude")) ?? DEFAULT_VIEWPORT.longitude;
  const zoom = tryParse(searchParams.get("zoom")) ?? DEFAULT_VIEWPORT.zoom;

  return {
    latitude,
    longitude,
    zoom
  }
}

export function serializeViewport(viewport: Partial<ViewState>) {
  return {
    "latitude": viewport.latitude?.toString() ?? "",
    "longitude": viewport.longitude?.toString() ?? "",
    "zoom": viewport.zoom?.toString() ?? ""
  }
}

function tryParse(val: string | null): number | null {
  try {
    if (val === null) {
      return null

    }
    const res = parseFloat(val);

    if (isNaN(res)) {
      throw Error("Could not parse number");
    }

    return res;
  } catch {
    return null;
  }
}
