// lib/modules/sensors/accelerometer/useAccelerometer.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  AccelerometerService, 
  AccelerometerData,
  AccelerometerSubscription 
} from './accelerometer.service';

/**
 * Tipo de retorno del hook
 */
export interface UseAccelerometerReturn {
  /** Datos actuales del acelerómetro */
  data: AccelerometerData;
  
  /** Indica si el sensor está activo y funcionando */
  isActive: boolean;
  
  /** Indica si el sensor está disponible en el dispositivo */
  isAvailable: boolean;
  
  /** Indica si está en proceso de inicialización */
  isLoading: boolean;
  
  /** Error si algo salió mal */
  error: string | null;
  
  /** Función para pausar/reanudar el sensor manualmente */
  toggleSensor: () => void;
}

/**
 * ═══════════════════════════════════════════════════════════
 * HOOK useAccelerometer
 * Conecta React con el acelerómetro de forma declarativa
 * ═══════════════════════════════════════════════════════════
 * 
 * @param autoStart - Si debe iniciar automáticamente (default: true)
 * @returns Objeto con datos del sensor y métodos de control
 * 
 * @example
 * function MyComponent() {
 *   const { data, isActive } = useAccelerometer();
 *   
 *   return (
 *     <Text>X: {data.x.toFixed(2)}</Text>
 *   );
 * }
 */
export const useAccelerometer = (autoStart: boolean = true): UseAccelerometerReturn => {
  // Estado del sensor
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(!autoStart);

  /**
   * Inicializa el sensor
   */
  const initializeSensor = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar disponibilidad
      const available = await AccelerometerService.isAvailable();
      setIsAvailable(available);

      if (!available) {
        setError('Acelerómetro no disponible en este dispositivo');
        setIsLoading(false);
        return null;
      }

      // Todo OK
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al inicializar: ${errorMessage}`);
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Inicia la escucha del sensor
   */
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

  /**
   * Toggle manual del sensor
   */
  const toggleSensor = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  /**
   * Effect principal: Ciclo de vida del sensor
   */
  useEffect(() => {
    let subscription: AccelerometerSubscription | null = null;
    let isMounted = true;

    const setup = async () => {
      // Inicializar
      const initialized = await initializeSensor();
      
      if (!initialized || !isMounted || isPaused) {
        return;
      }

      // Iniciar escucha
      subscription = startSensor();
    };

    setup();

    // Cleanup cuando el componente se desmonta o isPaused cambia
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

/**
 * ═══════════════════════════════════════════════════════════
 * VARIANTE: Hook simplificado (solo datos)
 * ═══════════════════════════════════════════════════════════
 */
export const useAccelerometerData = (): AccelerometerData => {
  const { data } = useAccelerometer();
  return data;
};

/**
 * ═══════════════════════════════════════════════════════════
 * VARIANTE: Hook con callback personalizado
 * ═══════════════════════════════════════════════════════════
 * 
 * @example
 * useAccelerometerCallback((data) => {
 *   if (isShaking(data)) {
 *     console.log('¡Agitación detectada!');
 *   }
 * });
 */
export const useAccelerometerCallback = (
  callback: (data: AccelerometerData) => void
): void => {
  const { data } = useAccelerometer();

  useEffect(() => {
    callback(data);
  }, [data, callback]);
};