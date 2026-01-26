import React, { useEffect, useRef, useState, memo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import StyledText from '../../components/atoms/Text';
import { COLORS } from '../../lib/core/constants';

const eulerAngles: { [key: number]: [number, number, number] } = {
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
};

const targetQuats = Object.fromEntries(
  Object.entries(eulerAngles).map(([k, v]) => [
    k,
    new THREE.Quaternion().setFromEuler(new THREE.Euler(...v)),
  ])
) as Record<number, THREE.Quaternion>;

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const frameRef = useRef<number | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const rotationalVelocity = useRef(new THREE.Vector3());

  const isRollingRef = useRef(isRolling);
  isRollingRef.current = isRolling;

  useEffect(() => {
    if (isRolling) {
      const spinStrength = 40 + Math.random() * 40;
      rotationalVelocity.current.set(
        (Math.random() - 0.5) * spinStrength,
        (Math.random() - 0.5) * spinStrength,
        (Math.random() - 0.5) * spinStrength
      );
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isRolling]);

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

      mesh.traverse((child: any) => {
        if (child.isMesh) {
            child.material = child.material.name === 'Dots'
                ? new THREE.MeshPhongMaterial({ color: pipsColor })
                : new THREE.MeshPhongMaterial({ color });
        }
      });

      modelRef.current = mesh;
      scene.add(mesh);
      setIsLoading(false);
    } catch (e) {
      console.error('Error loading model:', e);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const clock = new THREE.Clock();

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const model = modelRef.current;

      if (!model) return;
      
      if (isRollingRef.current) {
        const rv = rotationalVelocity.current;
        if (rv.lengthSq() > 0.0001) {
          rv.multiplyScalar(0.97);
          const rotationDeltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rv.x * delta, rv.y * delta, rv.z * delta));
          model.quaternion.multiplyQuaternions(rotationDeltaQuat, model.quaternion);
        }
      } else {
        const targetQuat = targetQuats[value] || targetQuats[1];
        if (model.quaternion.angleTo(targetQuat) > 0.01) {
          model.quaternion.slerp(targetQuat, 0.15);
        } else {
          model.quaternion.copy(targetQuat);
        }
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={StyleSheet.absoluteFill} color={COLORS.primary} />}
      {hasError && <StyledText style={styles.centered}>Error loading model.</StyledText>}
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 300, height: 300, overflow: 'hidden' },
  glView: { flex: 1 },
  centered: { flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'red' },
});

export default memo(DiceComponent);