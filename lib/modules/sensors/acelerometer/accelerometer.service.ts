import { Accelerometer } from 'expo-sensors';
import { UPDATE_INTERVAL } from '@/lib/core/constants';

export type AccelerometerData = {
  x: number;
  y: number;
  z: number;
};

export type AccelerometerCallback = (data: AccelerometerData) => void;

export type AccelerometerSubscription = {
  remove: () => void;
};

export const AccelerometerService = {
  isAvailable: async (): Promise<boolean> => {
    try {
      const available = await Accelerometer.isAvailableAsync();
      return available;
    } catch (error) {
      console.error('Error al verificar disponibilidad del acelerómetro:', error);
      return false;
    }
  },

  setUpdateInterval: (interval: number = UPDATE_INTERVAL): void => {
    try {
      Accelerometer.setUpdateInterval(interval);
    } catch (error) {
      console.error('Error al configurar intervalo:', error);
    }
  },

  subscribe: (callback: AccelerometerCallback): AccelerometerSubscription => {
    try {
      AccelerometerService.setUpdateInterval();
      
      const subscription = Accelerometer.addListener(callback);
      
      return subscription;
    } catch (error) {
      console.error('Error al suscribirse al acelerómetro:', error);
      
      return {
        remove: () => {},
      };
    }
  },

  unsubscribe: (subscription: AccelerometerSubscription | null): void => {
    try {
      if (subscription) {
        subscription.remove();
      }
    } catch (error) {
      console.error('Error al desuscribirse del acelerómetro:', error);
    }
  },

  removeAllListeners: (): void => {
    try {
      Accelerometer.removeAllListeners();
    } catch (error) {
      console.error('Error al remover listeners:', error);
    }
  },

  getCurrentReading: async (): Promise<AccelerometerData | null> => {
    return new Promise((resolve) => {
      let subscription: AccelerometerSubscription | null = null;
      
      const timeout = setTimeout(() => {
        if (subscription) {
          AccelerometerService.unsubscribe(subscription);
        }
        resolve(null);
      }, 1000);

      subscription = AccelerometerService.subscribe((data) => {
        clearTimeout(timeout);
        AccelerometerService.unsubscribe(subscription);
        resolve(data);
      });
    });
  },
};