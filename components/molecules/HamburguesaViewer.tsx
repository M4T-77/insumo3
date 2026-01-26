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
}

const disposeGroup = (group: THREE.Group) => {
  if (!group) return;
  group.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => material.dispose());
    }
  });
};

const loadModel = async (path: any): Promise<THREE.Object3D> => {
    const asset = Asset.fromModule(path);
    await asset.downloadAsync();
    const gltf = await new Promise<any>((res, rej) => new GLTFLoader().load(asset.localUri!, res, undefined, rej));
    const mesh = gltf.scene;
    mesh.traverse((child: any) => {
        if (child.isMesh) {
            child.geometry.computeVertexNormals();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat: any) => {
                if (mat) {
                    mat.flatShading = false;
                    mat.needsUpdate = true;
                }
            });
        }
    });
    return mesh;
};


const ModelViewerComponent: React.FC<ModelViewerProps> = ({ modelPaths }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const frameRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const glRef = useRef<any>(null);


  const onContextCreate = useCallback(async (gl: any) => {
    glRef.current = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(50, gl.aspect, 0.1, 200);
    cameraRef.current = camera;
    scene.add(new THREE.AmbientLight(0xffffff, 1.2), new THREE.DirectionalLight(0xffffff, 1.5));

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.5 * clock.getDelta();
      }
      if (sceneRef.current && cameraRef.current) {
        renderer.render(sceneRef.current, cameraRef.current);
      }
      gl.endFrameEXP();
    };

    const clock = new THREE.Clock();
    render();
  }, []);

  useEffect(() => {
    const updateModels = async () => {
      if (!sceneRef.current || !cameraRef.current) return;
      
      setIsLoading(true);
      setHasError(false);

      if (groupRef.current) {
        disposeGroup(groupRef.current);
        sceneRef.current.remove(groupRef.current);
      }
      
      const group = new THREE.Group();
      groupRef.current = group;
      sceneRef.current.add(group);
      
      try {
        const models = await Promise.all(modelPaths.map(loadModel));
        
        let accumulatedHeight = 0;
        const ingredientSeparation = 1.2;
        models.forEach((model, i) => {
            model.position.y = accumulatedHeight;
            group.add(model);
            if (i < models.length - 1) {
                accumulatedHeight += ingredientSeparation + (i === 0 ? 0.5 : 0) + (i === models.length - 2 ? 1.0 : 0);
            }
        });

        const box = new THREE.Box3().setFromObject(group);
        const center = new THREE.Vector3();
        box.getCenter(center);
        group.position.y = -center.y;

        const height = box.getSize(new THREE.Vector3()).y;
        cameraRef.current.position.z = (height / (2 * Math.tan(cameraRef.current.fov * Math.PI / 360))) * 1.5;
        cameraRef.current.position.y = 0;
        cameraRef.current.updateProjectionMatrix();

      } catch (e) {
        console.error('Error loading models:', e);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (glRef.current) {
        updateModels();
    }
  }, [modelPaths, glRef.current]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (groupRef.current) disposeGroup(groupRef.current);
      rendererRef.current?.dispose();
    };
  }, []);


  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator style={StyleSheet.absoluteFill} color={COLORS.primary} />}
      {hasError && <StyledText style={styles.centered}>Error loading models.</StyledText>}
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 400, height: 400, overflow: 'hidden' },
  glView: { flex: 1 },
  centered: { flex: 1, textAlign: 'center', textAlignVertical: 'center', color: 'red' },
});

export default memo(ModelViewerComponent);