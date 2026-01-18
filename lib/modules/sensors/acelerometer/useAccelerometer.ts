import { useState, useEffect, useCallback } from 'react';
import { 
  AccelerometerService, 
  AccelerometerData,
  AccelerometerSubscription 
} from './accelerometer.service';

export interface UseAccelerometerReturn {
  data: AccelerometerData;
  isActive: boolean;
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  toggleSensor: () => void;
}

export const useAccelerometer = (autoStart: boolean = true): UseAccelerometerReturn => {
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(!autoStart);

  const initializeSensor = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const available = await AccelerometerService.isAvailable();
      setIsAvailable(available);

      if (!available) {
        setError('Acelerómetro no disponible en este dispositivo');
        setIsLoading(false);
        return null;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al inicializar: ${errorMessage}`);
      setIsLoading(false);
      return null;
    }
  }, []);

  const startSensor = useCallback((): AccelerometerSubscription | null => {
    try {
      const subscription = AccelerometerService.subscribe((newData) => {
        setData(newData);
        setIsActive(true);
      });

      return subscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sensor';
      setError(errorMessage);
      setIsActive(false);
      return null;
    }
  }, []);

  const toggleSensor = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    let subscription: AccelerometerSubscription | null = null;
    let isMounted = true;

    const setup = async () => {
      const initialized = await initializeSensor();
      
      if (!initialized || !isMounted || isPaused) {
        return;
      }

      subscription = startSensor();
    };

    setup();

    return () => {
      isMounted = false;
      
      if (subscription) {
        AccelerometerService.unsubscribe(subscription);
        setIsActive(false);
      }
    };
  }, [isPaused, initializeSensor, startSensor]);

  return {
    data,
    isActive,
    isAvailable,
    isLoading,
    error,
    toggleSensor,
  };
};

export const useAccelerometerData = (): AccelerometerData => {
  const { data } = useAccelerometer();
  return data;
};

export const useAccelerometerCallback = (
  callback: (data: AccelerometerData) => void
): void => {
  const { data } = useAccelerometer();

  useEffect(() => {
    callback(data);
  }, [data, callback]);
};