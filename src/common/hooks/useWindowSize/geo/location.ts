import { RADIUS_OF_EARTH } from './consts';
import { Length } from './length';

export class GeoLocation {
  readonly latitude: number;
  readonly longitude: number;

  constructor(options: { latitude: number; longitude: number }) {
    this.latitude = options.latitude;
    this.longitude = options.longitude;
  }

  moveNorth(length: Length): GeoLocation {
    const diff = this.latitudeDiff(length);

    return new GeoLocation({
      longitude: this.longitude,
      latitude: this.latitude + diff,
    });
  }

  moveSouth(length: Length): GeoLocation {
    const diff = this.latitudeDiff(length);

    return new GeoLocation({
      longitude: this.longitude,
      latitude: this.latitude - diff,
    });
  }

  private latitudeDiff(length: Length): number {
    return (
      (length.toKilometers() / RADIUS_OF_EARTH.toKilometers()) * (180 / Math.PI)
    );
  }

  moveWest(length: Length): GeoLocation {
    const diff = this.longitudeDiff(length);

    return new GeoLocation({
      longitude: this.longitude - diff,
      latitude: this.latitude,
    });
  }

  moveEast(length: Length): GeoLocation {
    const diff = this.longitudeDiff(length);

    return new GeoLocation({
      longitude: this.longitude + diff,
      latitude: this.latitude,
    });
  }

  private longitudeDiff(length: Length): number {
    return (
      ((length.toKilometers() / RADIUS_OF_EARTH.toKilometers()) *
        (180 / Math.PI)) /
      Math.cos(this.latitude * (Math.PI / 180))
    );
  }

  getDistanceFrom(other: GeoLocation): Length {
    const lat1 = this.latitude;
    const lon1 = this.longitude;
    const lat2 = other.latitude;
    const lon2 = other.longitude;

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const lat1Radian = toRad(lat1);
    const lat2Radian = toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1Radian) *
        Math.cos(lat2Radian);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Length.kilometers(d);
  }
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
