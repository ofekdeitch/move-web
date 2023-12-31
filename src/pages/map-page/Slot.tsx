import React from 'react';
import { Point } from '.';

interface Props {
  point: Point;
  zoom: number
}

export const Slot: React.FC<Props> = ({ point, zoom }: Props) => {
  const size = Math.max(4, Math.pow((zoom / 8), 3));

  return (
    <div style={{
      height: `${size}px`,
      width: `${size}px`,
      background: getColor(point.value),
      borderRadius: '50px',
      opacity: 0.9,
      zIndex: point.value + 1,
      boxShadow: "0 2px 5px 1px rgba(0,0,0,0.2)"
    }} />
  );
}

export const COLORS = {
  RED: '#ff0061',
  ORANGE: '#ffb100',
  YELLOW: '#e3ff00',
  GREEN: '#74f775',
}

function getColor(value: number): string {
  if (value <= 1) {
    return COLORS.GREEN;
  } else if (value <= 2) {
    return COLORS.YELLOW;
  } else if (value <= 3) {
    return COLORS.ORANGE;
  } else {
    return COLORS.RED;
  }
}