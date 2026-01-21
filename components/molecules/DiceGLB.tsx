import React, { useEffect, useRef, useState, memo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import StyledText from '../../components/atoms/Text';
import { COLORS } from '../../lib/core/constants';

const targetQuats = Object.entries({
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
}).reduce((acc, [k, v]) => {
  acc[Number(k)] = new THREE.Quaternion().setFromEuler(new THREE.Euler(v[0], v[1], v[2]));
  return acc;
}, {} as Record<number, THREE.Quaternion>);

interface DiceGLBProps {
  value: number;
  isRolling?: boolean;
  modelPath?: number;
  color?: string;
  pipsColor?: string;
}

const DiceComponent: React.FC<DiceGLBProps> = ({
  value,
  isRolling = false,
  modelPath = require('../../assets/models/Dice.glb'),
  color = COLORS.primary,
  pipsColor = COLORS.diceDots,
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const frameRef = useRef<number | null>(null);

  const valueRef = useRef(value);
  valueRef.current = value;

  const isRollingRef = useRef(isRolling);
  isRollingRef.current = isRolling;

  const modelRef = useRef<THREE.Object3D | null>(null);
  const rotationalVelocity = useRef(new THREE.Vector3());

  useEffect(() => {
    if (isRolling) {
      const spinStrength = 40 + Math.random() * 40;
      rotationalVelocity.current.set(
        (Math.random() - 0.5) * spinStrength,
        (Math.random() - 0.5) * spinStrength,
        (Math.random() - 0.5) * spinStrength
      );
    }
  }, [isRolling]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, gl.aspect, 0.1, 100);
    camera.position.set(0, 1.5, 6);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8), new THREE.DirectionalLight(0xffffff, 1));

    try {
      const asset = Asset.fromModule(modelPath);
      await asset.downloadAsync();
      const gltf = await new Promise<any>((res, rej) => new GLTFLoader().load(asset.localUri!, res, undefined, rej));
      
      const mesh = gltf.scene;

      const diceMaterial = new THREE.MeshPhongMaterial({ color });
      const dotsMaterial = new THREE.MeshPhongMaterial({ color: pipsColor });

      mesh.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (child.material.name === 'Dots') {
            child.material = dotsMaterial;
          } else if (child.material.name === 'Dice') {
            child.material = diceMaterial;
          }
        }
      });

      modelRef.current = mesh;
      scene.add(mesh);
      setStatus('loaded');
    } catch (e) {
      console.error('Error loading model:', e);
      setStatus('error');
      return;
    }

    const clock = new THREE.Clock();
    let wasRolling = isRollingRef.current;

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const model = modelRef.current;

      if (model) {
        const isCurrentlyRolling = isRollingRef.current;
        const finalValue = valueRef.current;

        if (wasRolling && !isCurrentlyRolling) {
          rotationalVelocity.current.set(0, 0, 0);
        }

        if (isCurrentlyRolling) {
          const rv = rotationalVelocity.current;
          if (rv.lengthSq() > 0.0001) {
            const damping = 0.97;
            rv.multiplyScalar(damping);

            const rotationDeltaQuat = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(rv.x * delta, rv.y * delta, rv.z * delta)
            );
            model.quaternion.multiplyQuaternions(rotationDeltaQuat, model.quaternion);
          }
        } else {
          const targetQuat = targetQuats[finalValue] || targetQuats[1];

          if (model.quaternion.angleTo(targetQuat) > 0.01) {
            model.quaternion.slerp(targetQuat, 0.15); 
          } else {
            model.quaternion.copy(targetQuat);
          }
        }
        
        wasRolling = isCurrentlyRolling;
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={styles.container}>
      {status !== 'loaded' && (
        <View style={StyleSheet.absoluteFill}>
          {status === 'loading' 
            ? <ActivityIndicator style={styles.centered} color={COLORS.primary} /> 
            : <StyledText style={styles.centered}>Error loading model.</StyledText>}
        </View>
      )}
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 300, height: 300, overflow: 'hidden' },
  glView: { flex: 1 },
  centered: { flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'red' },
});

const DiceGLB = memo(DiceComponent);

export default DiceGLB;