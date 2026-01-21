import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import StyledText from '../atoms/Text';
import { COLORS } from '../../lib/core/constants';

interface ModelViewerProps {
  modelPaths: any[];
  isRolling?: boolean;
}

const yPositions = [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0];

const ModelViewerComponent: React.FC<ModelViewerProps> = ({ modelPaths, isRolling = false }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const frameRef = useRef<number | null>(null);
  const isRollingRef = useRef(isRolling);
  const groupRef = useRef<THREE.Group | null>(null);
  const rotationalVelocity = useRef(new THREE.Vector3());

  isRollingRef.current = isRolling;

  useEffect(() => {
    if (isRolling) {
      rotationalVelocity.current.set(0, 20 + Math.random() * 20, 0);
    }
  }, [isRolling]);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const onContextCreate = useCallback(async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, gl.aspect, 0.1, 100);
    camera.position.set(0, 1.5, 15);

    scene.add(
      new THREE.AmbientLight(0xffffff, 0.6),
      new THREE.DirectionalLight(0xffffff, 0.8)
    );

    try {
      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      for (let i = 0; i < modelPaths.length; i++) {
        const asset = Asset.fromModule(modelPaths[i]);
        await asset.downloadAsync();
        
        const gltf = await new Promise<any>((res, rej) => 
          new GLTFLoader().load(asset.localUri!, res, undefined, rej)
        );
        
        const mesh = gltf.scene;

        mesh.traverse((child: any) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.computeVertexNormals();
            
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat: any) => {
              if (mat) {
                mat.flatShading = false;
                mat.needsUpdate = true;
              }
            });
          }
        });

        mesh.position.y = yPositions[i] || 0;
        group.add(mesh);
      }
      
      const box = new THREE.Box3().setFromObject(group);
      group.position.y = -box.getCenter(new THREE.Vector3()).y;

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
      const group = groupRef.current;

      if (group) {
        const isCurrentlyRolling = isRollingRef.current;

        if (wasRolling && !isCurrentlyRolling) {
          rotationalVelocity.current.set(0, 0, 0);
        }

        if (isCurrentlyRolling) {
          const rv = rotationalVelocity.current;
          if (rv.lengthSq() > 0.0001) {
            rv.multiplyScalar(0.985);
            const rotationDelta = new THREE.Quaternion().setFromEuler(
              new THREE.Euler(rv.x * delta, rv.y * delta, rv.z * delta)
            );
            group.quaternion.multiplyQuaternions(rotationDelta, group.quaternion);
          }
        }
        
        wasRolling = isCurrentlyRolling;
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  }, [modelPaths]);

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

export default memo(ModelViewerComponent);