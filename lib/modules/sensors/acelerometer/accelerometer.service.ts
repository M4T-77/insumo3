// lib/modules/sensors/accelerometer/accelerometer.service.ts

import { Accelerometer } from 'expo-sensors';
import { UPDATE_INTERVAL } from '@/lib/core/constants';

/**
 * Tipo de dato del acelerómetro
 */
export type AccelerometerData = {
  x: number;
  y: number;
  z: number;
};

/**
 * Tipo del callback que recibe datos del sensor
 */
export type AccelerometerCallback = (data: AccelerometerData) => void;

/**
 * Tipo de la suscripción (para limpiar después)
 */
export type AccelerometerSubscription = {
  remove: () => void;
};

/**
 * ═══════════════════════════════════════════════════════════
 * SERVICIO DE ACELERÓMETRO
 * Maneja toda la comunicación con el hardware del sensor
 * ═══════════════════════════════════════════════════════════
 */
export const AccelerometerService = {
  /**
   * Verifica si el acelerómetro está disponible en el dispositivo
   * 
   * @returns Promise<boolean> - true si el sensor está disponible
   * 
   * @example
   * const available = await AccelerometerService.isAvailable();
   * if (!available) {
   *   console.log('Este dispositivo no tiene acelerómetro');
   * }
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      const available = await Accelerometer.isAvailableAsync();
      return available;
    } catch (error) {
      console.error('Error al verificar disponibilidad del acelerómetro:', error);
      return false;
    }
  },

  /**
   * Configura la frecuencia de actualización del sensor
   * 
   * @param interval - Intervalo en milisegundos (default: UPDATE_INTERVAL)
   * 
   * @example
   * AccelerometerService.setUpdateInterval(100); // 10 lecturas por segundo
   */
  setUpdateInterval: (interval: number = UPDATE_INTERVAL): void => {
    try {
      Accelerometer.setUpdateInterval(interval);
    } catch (error) {
      console.error('Error al configurar intervalo:', error);
    }
  },

  /**
   * Inicia la escucha del acelerómetro
   * 
   * @param callback - Función que se ejecuta cada vez que hay nuevos datos
   * @returns Suscripción para poder cancelar después
   * 
   * @example
   * const subscription = AccelerometerService.subscribe((data) => {
   *   console.log(`X: ${data.x}, Y: ${data.y}, Z: ${data.z}`);
   * });
   */
  subscribe: (callback: AccelerometerCallback): AccelerometerSubscription => {
    try {
      // Configurar intervalo antes de suscribirse
      AccelerometerService.setUpdateInterval();
      
      // Iniciar la escucha
      const subscription = Accelerometer.addListener(callback);
      
      return subscription;
    } catch (error) {
      console.error('Error al suscribirse al acelerómetro:', error);
      
      // Retornar suscripción dummy en caso de error
      return {
        remove: () => {},
      };
    }
  },

  /**
   * Detiene la escucha del acelerómetro
   * IMPORTANTE: Siempre llamar esto para evitar memory leaks
   * 
   * @param subscription - La suscripción retornada por subscribe()
   * 
   * @example
   * const subscription = AccelerometerService.subscribe(...);
   * // ... más tarde
   * AccelerometerService.unsubscribe(subscription);
   */
  unsubscribe: (subscription: AccelerometerSubscription | null): void => {
    try {
      if (subscription) {
        subscription.remove();
      }
    } catch (error) {
      console.error('Error al desuscribirse del acelerómetro:', error);
    }
  },

  /**
   * Detiene TODAS las suscripciones activas
   * Útil para limpiar en caso de emergencia
   * 
   * @example
   * AccelerometerService.removeAllListeners();
   */
  removeAllListeners: (): void => {
    try {
      Accelerometer.removeAllListeners();
    } catch (error) {
      console.error('Error al remover listeners:', error);
    }
  },

  /**
   * Obtiene una única lectura del acelerómetro (sin suscripción continua)
   * Útil para debugging o calibración
   * 
   * @returns Promise<AccelerometerData | null>
   * 
   * @example
   * const reading = await AccelerometerService.getCurrentReading();
   * console.log(reading); // { x: 0.1, y: 0.98, z: 0.05 }
   */
  getCurrentReading: async (): Promise<AccelerometerData | null> => {
    return new Promise((resolve) => {
      let subscription: AccelerometerSubscription | null = null;
      
      const timeout = setTimeout(() => {
        if (subscription) {
          AccelerometerService.unsubscribe(subscription);
        }
        resolve(null);
      }, 1000); // Timeout de 1 segundo

      subscription = AccelerometerService.subscribe((data) => {
        clearTimeout(timeout);
        AccelerometerService.unsubscribe(subscription);
        resolve(data);
      });
    });
  },
};