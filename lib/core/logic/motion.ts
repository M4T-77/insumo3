export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export const getMagnitude = (data: Vector3): number => {
  return Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
};

class ShakeDetector {
  private lastMeasurement: Vector3 | null = null;
  private lastTimestamp: number | null = null;

  public isShaking(data: Vector3, threshold: number): boolean {
    const now = Date.now();

    if (!this.lastMeasurement || !this.lastTimestamp) {
      this.lastMeasurement = data;
      this.lastTimestamp = now;
      return false;
    }

    const timeDelta = now - this.lastTimestamp;

    if (timeDelta > 250) {
        this.lastMeasurement = data;
        this.lastTimestamp = now;
        return false;
    }

    const deltaX = data.x - this.lastMeasurement.x;
    const deltaY = data.y - this.lastMeasurement.y;
    const deltaZ = data.z - this.lastMeasurement.z;
    const force = Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2);

    this.lastMeasurement = data;
    this.lastTimestamp = now;

    return force > threshold;
  }
}

const shakeDetector = new ShakeDetector();

export const isShaking = (data: Vector3, threshold: number): boolean => {
  return shakeDetector.isShaking(data, threshold);
};


export const normalizeVector = (data: Vector3, maxValue: number = 3): Vector3 => {
  return {
    x: Math.abs(data.x) / maxValue,
    y: Math.abs(data.y) / maxValue,
    z: Math.abs(data.z) / maxValue,
  };
};

export const getTiltAngle = (data: Vector3): number => {
  const angleRad = Math.atan2(data.y, data.x);
  const angleDeg = angleRad * (180 / Math.PI);
  return angleDeg < 0 ? angleDeg + 360 : angleDeg;
};