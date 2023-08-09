import React from 'react';
import { Point } from '.';

interface Props {
  point: Point;
}

export const Slot: React.FC<Props> = ({ point }: Props) => {
  return (
    <div style={{
      height: '20px',
      width: '20px',
      background: getColor(point.value),
      borderRadius: '50px',
      padding: '2px',
      textAlign: 'center',
      opacity: 0.6
    }} />
  );
}

const COLORS = {
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