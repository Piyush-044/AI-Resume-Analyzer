import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef();
  
  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Sphere distribution
      const r = Math.random() * 3 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Colors: indigo to cyan gradient
      const t = Math.random();
      col[i * 3] = 0.38 + t * 0.15;     // R
      col[i * 3 + 1] = 0.4 + t * 0.3;   // G
      col[i * 3 + 2] = 0.9 + t * 0.1;   // B
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.04;
      ref.current.rotation.y -= delta * 0.06;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </Points>
  );
}

function NeuralConnections() {
  const ref = useRef();
  
  const lineGeometry = useMemo(() => {
    const points = [];
    const nodeCount = 18;
    const nodes = Array.from({ length: nodeCount }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 2
    ));
    
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j && node.distanceTo(other) < 1.8) {
          points.push(node, other);
        }
      });
    });
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.3;
    }
  });

  return (
    <lineSegments ref={ref} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function ParticleCanvas({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <StarField />
        <NeuralConnections />
      </Canvas>
    </div>
  );
}
