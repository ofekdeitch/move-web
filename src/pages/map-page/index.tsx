import React, { useEffect, useState } from 'react';
import Map, { Layer, Marker, Source, ViewState, ViewStateChangeEvent, } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useWindowSize } from '../../common/hooks/useWindowSize';
import axios from 'axios';
import { COLORS, Slot } from './Slot';
import { GeoLocation, Length } from '../../common/hooks/useWindowSize/geo';
import { GeoJSONSourceOptions } from "mapbox-gl";
import { HeatmapLayer } from './HeatmapLayer';

const SLOT_SIZE = Length.meters(20);

interface Props { }

const initialViewport: Partial<ViewState> = {
  latitude: 32.07251,
  longitude: 34.77915,
  zoom: 16
}

interface HeatmapLayer {
  color: string;
  coordinates: HeatMapSlot[];
}

// const slotBottomLeft = new GeoLocation({ latitude: 32.07251, longitude: 34.77915 })
// const slotTopLeft = slotBottomLeft.moveNorth(SLOT_SIZE);
// const slotTopRight = slotTopLeft.moveEast(SLOT_SIZE);
// const slotBottomRight = slotBottomLeft.moveEast(SLOT_SIZE);

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

  const redSlots: HeatMapSlot[] = filterPoints(points, { min: 4, max: 4 });
  const greenSlots: HeatMapSlot[] = filterPoints(points, { min: 1, max: 3 });

  const layers: HeatmapLayer[] = [
    { color: COLORS.RED, coordinates: redSlots },
    // { color: COLORS.ORANGE, coordinates: orangeLayerCoordinates }
  ]

  const slot1 = pointToSlot({ location: { latitude: 32.07251, longitude: 34.77915 }, value: 1 });
  const slot2 = pointToSlot({ location: { latitude: 32.07251, longitude: 34.77945 }, value: 1 });
  const slot3 = pointToSlot({ location: { latitude: 32.07251, longitude: 34.77975 }, value: 1 });

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
        {/* <Source type="geojson" data={{
          "type": "FeatureCollection",
          "features": redSlots.map(slot => (
            {
              "type": "Feature",
              "properties": {
              },
              "geometry":
              {
                "type": "Polygon",
                "coordinates": [slot]
              }
            }))
        }}>
          <Layer
            id='data'
            type='fill'
            paint={{
              'fill-color': COLORS.RED,
              'fill-opacity': 0.6
            }} />
        </Source>
        <Source type="geojson" data={{
          "type": "FeatureCollection",
          "features": greenSlots.map(slot => (
            {
              "type": "Feature",
              "properties": {
              },
              "geometry":
              {
                "type": "Polygon",
                "coordinates": [slot]
              }
            }))
        }}>
          <Layer
            id='data2'
            type='fill'
            paint={{
              'fill-color': COLORS.GREEN,
              'fill-opacity': 0.6
            }} />
        </Source> */}

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


type MapPoint = [number, number];
type HeatMapSlot = [MapPoint, MapPoint, MapPoint, MapPoint];

function toMapPoint(location: GeoLocation): MapPoint {
  return [location.longitude, location.latitude];
}

function filterPoints(points: Point[], range: { min: number, max: number }): HeatMapSlot[] {
  const filteredPoints = points.filter((p) => p.value >= range.min && p.value <= range.max);
  return filteredPoints.map((p) => pointToSlot(p));
}

function pointToSlot(point: Point): HeatMapSlot {
  const slotBottomLeft = new GeoLocation(point.location);
  const slotTopLeft = slotBottomLeft.moveNorth(SLOT_SIZE);
  const slotTopRight = slotTopLeft.moveEast(SLOT_SIZE);
  const slotBottomRight = slotBottomLeft.moveEast(SLOT_SIZE);

  return [toMapPoint(slotBottomLeft), toMapPoint(slotTopLeft), toMapPoint(slotTopRight), toMapPoint(slotBottomRight)]
}