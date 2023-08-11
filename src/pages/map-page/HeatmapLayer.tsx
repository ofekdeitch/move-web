import React from 'react';
import { GeoLocation, Length } from '../../common/hooks/useWindowSize/geo';
import { Point } from '.';
import { Layer, Source } from 'react-map-gl';

interface Props {
  range: { min?: number, max?: number };
  points: Point[];
  slotSize: Length;
  color: string;
  id: string;
}

export const HeatmapLayer: React.FC<Props> = ({ id, slotSize, points, range, color }: Props) => {
  const slots: HeatMapSlot[] = filterPoints(points, range, slotSize);

  return (
    <Source type="geojson" data={{
      "type": "FeatureCollection",
      "features": slots.map(slot => (
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
        id={id}
        type='fill'
        paint={{
          'fill-color': color,
          'fill-opacity': 0.3
        }} />
    </Source>
  );
}

type MapPoint = [number, number];
type HeatMapSlot = [MapPoint, MapPoint, MapPoint, MapPoint];

function filterPoints(points: Point[], range: { min?: number, max?: number }, slotSize: Length): HeatMapSlot[] {
  const minPredicate = (value: number) => !!range.min ? value >= range.min : true;
  const maxPredicate = (value: number) => !!range.max ? value <= range.max : true;

  const filteredPoints = points.filter((p) => minPredicate(p.value) && maxPredicate(p.value));
  return filteredPoints.map((p) => pointToSlot(p, slotSize));
}

function pointToSlot(point: Point, slotSize: Length): HeatMapSlot {
  const slotBottomLeft = new GeoLocation(point.location);
  const slotTopLeft = slotBottomLeft.moveNorth(slotSize);
  const slotTopRight = slotTopLeft.moveEast(slotSize);
  const slotBottomRight = slotBottomLeft.moveEast(slotSize);

  return [toMapPoint(slotBottomLeft), toMapPoint(slotTopLeft), toMapPoint(slotTopRight), toMapPoint(slotBottomRight)]
}

function toMapPoint(location: GeoLocation): MapPoint {
  return [location.longitude, location.latitude];
}