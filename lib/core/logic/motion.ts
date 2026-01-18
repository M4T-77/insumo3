export type Vector3 = { 
    x: number; 
    y: number; 
    z: number; 
  };
  
  export const getMagnitude = (data: Vector3): number => {
    return Math.sqrt(
      data.x ** 2 + 
      data.y ** 2 + 
      data.z ** 2
    );
  };
  
  export const isShaking = (data: Vector3, threshold: number = 1.78): boolean => {
    return getMagnitude(data) > threshold;
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