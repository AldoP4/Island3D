
import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Cloud, 
  Float, 
  Sparkles, 
  Environment, 
  MeshDistortMaterial,
  ContactShadows,
  Torus,
  Instance,
  Instances,
  Stars,
  Trail
} from '@react-three/drei';
import * as THREE from 'three';

// --- ASSETS & COMPONENTS ---

// Lantern Component
const Lantern = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[2]) * 0.03;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* String */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Lantern Body */}
      <mesh position={[0, -0.05, 0]}>
        <dodecahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight distance={1.5} intensity={1} color="#f59e0b" decay={2} />
    </group>
  )
}

// Detailed Low-Poly Tree with varied colors and Lanterns
const DetailedTree = ({ position, scale = 1, color = "#15803d" }: { position: [number, number, number], scale?: number, color?: string }) => {
  const hasLantern = useMemo(() => Math.random() > 0.4, []); // 40% chance of lantern
  
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
        <meshStandardMaterial color="#3f2e25" flatShading />
      </mesh>
      {/* Foliage Layers */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.7, 1.0, 7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.55, 0.9, 7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.35, 0.8, 7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      
      {/* Hanging Lantern */}
      {hasLantern && <Lantern position={[0.4, 1.0, 0]} />}
    </group>
  );
};

// Procedural Grass & Flowers
const Vegetation = () => {
  const grassData = useMemo(() => {
    const items = [];
    for(let i=0; i<2500; i++) {
        const r = Math.sqrt(Math.random()) * 3.8; 
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        
        // Avoid pond, path, and center (character) areas
        if (x > 1.2 && Math.abs(z) < 1.5) continue; // Pond
        if (x > -1.5 && x < 0.5 && Math.abs(z - x) < 0.5) continue; // Path approx
        if (Math.sqrt(x*x + z*z) < 0.8) continue; // Center clearing

        items.push({
            pos: [x, 0, z],
            rot: [0, Math.random() * Math.PI, 0],
            scale: 0.5 + Math.random() * 0.5
        });
    }
    return items;
  }, []);

  const flowerData = useMemo(() => {
      return grassData.filter((_, i) => i % 25 === 0).map(g => ({
          ...g,
          color: Math.random() > 0.6 ? "#fdf4ff" : (Math.random() > 0.5 ? "#fef08a" : "#f472b6")
      }))
  }, [grassData]);

  return (
    <group position={[0, 0.77, 0]}>
        {/* Grass Blades */}
        <Instances range={2500}>
            <planeGeometry args={[0.05, 0.5]} />
            <meshStandardMaterial color="#65a30d" side={THREE.DoubleSide} />
            {grassData.map((g: any, i) => (
                <Instance key={i} position={g.pos} rotation={g.rot} scale={g.scale} />
            ))}
        </Instances>

        {/* Flowers */}
        {flowerData.map((f, i) => (
             <mesh key={`flower-${i}`} position={[f.pos[0], 0.2, f.pos[2]]} rotation={f.rot as any} scale={0.3}>
                 <dodecahedronGeometry args={[0.2, 0]} />
                 <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.5} />
             </mesh>
        ))}
    </group>
  );
};

// Decorative Bushes
const Bushes = () => {
    const bushData = useMemo(() => [
        { pos: [-1.5, 0.8, -1.5], scale: 0.5 },
        { pos: [-2.5, 0.8, 0.5], scale: 0.6 },
        { pos: [1.0, 0.8, -2.2], scale: 0.4 },
        { pos: [2.8, 0.8, 1.2], scale: 0.5 },
    ], []);

    return (
        <group>
            {bushData.map((b, i) => (
                <mesh key={i} position={b.pos as any} scale={b.scale} castShadow receiveShadow>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#365314" flatShading />
                </mesh>
            ))}
        </group>
    )
}

// Scattered Pebbles
const Pebbles = () => {
    const pebbles = useMemo(() => {
        return Array.from({ length: 150 }).map(() => {
             const r = Math.sqrt(Math.random()) * 3.5; 
             const theta = Math.random() * 2 * Math.PI;
             return {
                 pos: [r * Math.cos(theta), 0, r * Math.sin(theta)],
                 scale: Math.random() * 0.08 + 0.02,
                 rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
             }
        }).filter(p => Math.sqrt(p.pos[0]**2 + p.pos[2]**2) > 0.8); // Clear center
    }, []);

    return (
        <group position={[0, 0.78, 0]}>
             <Instances range={150}>
                 <dodecahedronGeometry args={[1, 0]} />
                 <meshStandardMaterial color="#64748b" flatShading />
                 {pebbles.map((p, i) => (
                     <Instance key={i} position={p.pos as any} rotation={p.rot as any} scale={p.scale} />
                 ))}
             </Instances>
        </group>
    )
}

// Glowing Mushrooms
const Mushrooms = () => {
    const pos = [
        [-2, 1.5], [-2.2, 1.6], [-1.8, 1.8], // Clump 1
        [0.5, 1.8], [0.7, 1.9], [0.6, 2.0] // Clump 2
    ];
    return (
        <group position={[0, 0.78, 0]}>
            {pos.map((p, i) => (
                <group key={i} position={[p[0], 0, p[1]]} scale={0.3 + Math.random() * 0.2}>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.05, 0.08, 0.4, 5]} />
                        <meshStandardMaterial color="#fefce8" />
                    </mesh>
                    <mesh position={[0, 0.4, 0]}>
                        <coneGeometry args={[0.25, 0.2, 6]} />
                        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
                    </mesh>
                    <pointLight distance={0.5} intensity={0.5} color="#ef4444" />
                </group>
            ))}
        </group>
    )
}

// Stone Pathway
const Pathway = () => {
    const steps = [
        [-1.5, 1.5], [-1.2, 1.2], [-0.9, 0.9], [-0.6, 0.6], [-0.3, 0.3]
    ];
    return (
        <group position={[0, 0.77, 0]}>
             {steps.map((s, i) => (
                 <mesh key={i} position={[s[0], 0, s[1]]} rotation={[-Math.PI/2, 0, Math.random()]}>
                     <circleGeometry args={[0.2 + Math.random() * 0.1, 7]} />
                     <meshStandardMaterial color="#94a3b8" roughness={0.8} />
                 </mesh>
             ))}
        </group>
    )
}

// Rocks around the rim to break the perfect cylinder
const RimRocks = () => {
    const rocks = useMemo(() => Array.from({length: 24}).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return {
            pos: [Math.cos(angle) * 1.95, 0, Math.sin(angle) * 1.95],
            scale: 0.15 + Math.random() * 0.25,
            rot: [Math.random(), Math.random(), Math.random()]
        }
    }), []);

    return (
        <group position={[0, 0.7, 0]}>
            {rocks.map((r, i) => (
                <mesh key={i} position={r.pos as any} rotation={r.rot as any} scale={r.scale} castShadow receiveShadow>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#475569" flatShading />
                </mesh>
            ))}
        </group>
    )
}

// Lily Pads on Water
const LilyPads = () => {
    const pads = useMemo(() => [
        { pos: [2.2, 0.97, 0.2], rot: 1 },
        { pos: [2.5, 0.97, -0.3], rot: 2 },
        { pos: [1.9, 0.97, -0.1], rot: 0.5 },
    ], []);

    return (
        <group>
            {pads.map((p, i) => (
                <group key={i} position={p.pos as any} rotation={[0, p.rot, 0]} scale={0.3}>
                    <mesh rotation={[-Math.PI/2, 0, 0]}>
                        <circleGeometry args={[0.5, 16]} />
                        <meshStandardMaterial color="#15803d" />
                    </mesh>
                    {/* Small Flower */}
                    {i === 0 && (
                        <mesh position={[0, 0.1, 0]}>
                             <dodecahedronGeometry args={[0.15, 0]} />
                             <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.5} />
                        </mesh>
                    )}
                </group>
            ))}
        </group>
    )
}

// Fireflies
const Fireflies = () => {
    const ref = useRef<THREE.Group>(null);
    const [fireflies] = useState(() => Array.from({ length: 30 }).map(() => ({
        position: new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            Math.random() * 2 + 0.5,
            (Math.random() - 0.5) * 4
        ),
        speed: Math.random() * 0.5 + 0.2,
        offset: Math.random() * 100
    })));

    useFrame((state) => {
        if(ref.current) {
            fireflies.forEach((f, i) => {
                const t = state.clock.elapsedTime;
                const mesh = ref.current?.children[i];
                if(mesh) {
                    mesh.position.x = f.position.x + Math.sin(t * f.speed + f.offset) * 0.5;
                    mesh.position.y = f.position.y + Math.cos(t * f.speed * 0.5 + f.offset) * 0.2;
                    mesh.position.z = f.position.z + Math.sin(t * f.speed * 0.3 + f.offset) * 0.5;
                }
            });
        }
    });

    return (
        <group ref={ref}>
            {fireflies.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.02]} />
                    <meshBasicMaterial color="#fef08a" />
                </mesh>
            ))}
        </group>
    )
}

// Waterfall Particle System
const WaterfallParticles = () => {
  const count = 400;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
      return new Array(count).fill(0).map(() => ({
          pos: new THREE.Vector3(
              3.2 + (Math.random() - 0.5) * 0.8, 
              0.8, 
              (Math.random() - 0.5) * 0.6
          ),
          speed: 0.08 + Math.random() * 0.1,
      }));
  }, []);

  useFrame(() => {
      if (!mesh.current) return;
      particles.forEach((p, i) => {
          p.pos.y -= p.speed;
          if (p.pos.y < -5) {
              p.pos.y = 0.8;
              p.pos.x = 3.2 + (Math.random() - 0.5) * 0.6;
              p.pos.z = (Math.random() - 0.5) * 0.4;
          }
          dummy.position.copy(p.pos);
          dummy.scale.setScalar(Math.random() * 0.08 + 0.02);
          dummy.updateMatrix();
          mesh.current!.setMatrixAt(i, dummy.matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.6} />
      </instancedMesh>
  );
};

// Hanging Vines / Roots
const HangingRoots = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 2.0 + Math.random() * 1.5;
        return (
            <mesh 
                key={i} 
                position={[Math.cos(angle)*r, -0.5, Math.sin(angle)*r]} 
                rotation={[0, 0, Math.random() * 0.5 - 0.25]}
            >
                <coneGeometry args={[0.08, 3 + Math.random() * 2.5, 5]} />
                <meshStandardMaterial color="#57534e" flatShading />
            </mesh>
        )
      })}
    </group>
  )
}

// Glowing Crystal Roots underneath
const CrystalRoots = () => {
    return (
        <group position={[0, -2.5, 0]}>
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[(Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5]} rotation={[Math.random(), Math.random(), Math.random()]}>
                    <octahedronGeometry args={[0.4, 0]} />
                    <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1} transparent opacity={0.7} />
                </mesh>
            ))}
        </group>
    )
}

// Cliff Details
const CliffDetails = () => {
    const details = useMemo(() => [...Array(25)].map(() => ({
        pos: [
            (Math.random() - 0.5) * 3.8,
            -1 - Math.random() * 2.5,
            (Math.random() - 0.5) * 3.8
        ],
        scale: 0.4 + Math.random() * 0.6
    })), []);

    return (
        <group>
            {details.map((d, i) => (
                <mesh key={i} position={d.pos as any} rotation={[Math.random(), Math.random(), Math.random()]}>
                    <dodecahedronGeometry args={[d.scale, 0]} />
                    <meshStandardMaterial color="#334155" flatShading />
                </mesh>
            ))}
        </group>
    )
}

// Guardian Stones (Pro Detail)
const GuardianStones = () => {
    return (
        <group position={[2.5, 0.8, 2.0]} rotation={[0, -0.5, 0]}>
             <mesh position={[0, 0.6, 0]} castShadow>
                 <boxGeometry args={[0.5, 1.5, 0.5]} />
                 <meshStandardMaterial color="#64748b" roughness={0.6} />
             </mesh>
             <mesh position={[0, 0.6, 0]}>
                 <boxGeometry args={[0.55, 0.1, 0.55]} />
                 <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
             </mesh>
             <mesh position={[0.5, 0.4, 0.2]} rotation={[0, 0, 0.2]} scale={0.6}>
                 <boxGeometry args={[0.5, 1.2, 0.5]} />
                 <meshStandardMaterial color="#475569" roughness={0.6} />
             </mesh>
        </group>
    )
}

// Meditating Girl Character (Pro Detail)
const MeditatingGirl = () => {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            // Levitate
            group.current.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
        }
    });

    const skinColor = "#f0d5b7";
    const shirtColor = "#f8fafc";
    const pantsColor = "#e2e8f0";
    const hairColor = "#334155";

    return (
        <group ref={group} position={[0, 0.95, 0]}>
            {/* --- Body Parts --- */}
            
            {/* Legs (Crossed) */}
            <group position={[0, 0.1, 0]}>
                <mesh position={[0.15, 0, 0.1]} rotation={[1.2, 0.5, 0]} castShadow>
                    <capsuleGeometry args={[0.07, 0.4, 4, 8]} />
                    <meshStandardMaterial color={pantsColor} />
                </mesh>
                <mesh position={[-0.15, 0, 0.1]} rotation={[1.2, -0.5, 0]} castShadow>
                    <capsuleGeometry args={[0.07, 0.4, 4, 8]} />
                    <meshStandardMaterial color={pantsColor} />
                </mesh>
            </group>

            {/* Torso */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.14, 0.4, 8]} />
                <meshStandardMaterial color={shirtColor} />
            </mesh>
            
            {/* Arms */}
            <group position={[0, 0.35, 0]}>
                 <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.4]}>
                    <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
                    <meshStandardMaterial color={skinColor} />
                 </mesh>
                 <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.4]}>
                    <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
                    <meshStandardMaterial color={skinColor} />
                 </mesh>
            </group>

            {/* Hands (resting on knees) */}
            <mesh position={[0.25, 0.2, 0.1]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>
            <mesh position={[-0.25, 0.2, 0.1]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 0.62, 0]} castShadow>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshStandardMaterial color={skinColor} />
            </mesh>

            {/* Hair */}
            <group position={[0, 0.65, -0.02]}>
                <mesh>
                    <sphereGeometry args={[0.115, 16, 16]} />
                    <meshStandardMaterial color={hairColor} />
                </mesh>
                {/* Ponytail */}
                <mesh position={[0, -0.1, -0.12]} rotation={[-0.5, 0, 0]}>
                     <coneGeometry args={[0.08, 0.3, 8]} />
                     <meshStandardMaterial color={hairColor} />
                </mesh>
            </group>

            {/* Scarf/Cape Detail */}
            <mesh position={[0, 0.52, 0]} rotation={[0.2, 0, 0]}>
                <torusGeometry args={[0.11, 0.04, 8, 16]} />
                <meshStandardMaterial color="#0ea5e9" />
            </mesh>
        </group>
    )
}

// Magic Circle on Ground
const MagicCircle = () => {
    return (
        <group position={[0, 0.78, 0]} rotation={[-Math.PI/2, 0, 0]}>
             <mesh>
                 <ringGeometry args={[0.6, 0.65, 32]} />
                 <meshBasicMaterial color="#67e8f9" transparent opacity={0.6} side={THREE.DoubleSide} />
             </mesh>
             <mesh rotation={[0, 0, 0.5]}>
                 <ringGeometry args={[0.45, 0.48, 4]} />
                 <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} side={THREE.DoubleSide} />
             </mesh>
        </group>
    )
}

// Floating Runes Orbiting Character
const FloatingRunes = () => {
    const group = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (group.current) {
            group.current.rotation.y = clock.getElapsedTime() * 0.5;
        }
    });

    const runes = [0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2;
        return { pos: [Math.cos(angle) * 0.8, Math.sin(angle) * 0.2, Math.sin(angle) * 0.8], rot: [0, -angle, 0] }
    });

    return (
        <group position={[0, 1.3, 0]} ref={group}>
             {runes.map((r, i) => (
                 <mesh key={i} position={r.pos as any} rotation={r.rot as any}>
                     <octahedronGeometry args={[0.06, 0]} />
                     <meshStandardMaterial color="#cffafe" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
                 </mesh>
             ))}
        </group>
    )
}

// Ancient Ruin Arch
const RuinArch = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    return (
        <group position={position} rotation={rotation as any}>
            <mesh position={[-0.6, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.4, 2.2, 0.4]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0.6, 0.8, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.4, 1.8, 0.4]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, 2, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.8, 0.4, 0.5]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} flatShading />
            </mesh>
            {/* Moss */}
            <mesh position={[-0.6, 1.5, 0.21]} scale={[0.3, 0.3, 0.1]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#4d7c0f" />
            </mesh>
        </group>
    )
}

// Rotating Magical Rings
const MagicRings = () => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.005;
            ref.current.rotation.x = Math.PI/2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={ref} position={[0, 2.5, 0]}>
             <Torus args={[3.0, 0.02, 16, 100]} rotation={[Math.PI/2, 0, 0]}>
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} />
             </Torus>
             <Torus args={[2.5, 0.04, 16, 100]} rotation={[0.2, 0, 0]}>
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
             </Torus>
        </group>
    )
}

// Crystal Shard
const Crystal = ({ position, scale = 1, color = "#a5f3fc" }: any) => (
    <group position={position} scale={scale}>
        <mesh castShadow>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={2}
                toneMapped={false}
                roughness={0.1}
                metalness={0.9}
            />
        </mesh>
        <Sparkles count={10} scale={2} size={4} speed={0.4} opacity={0.5} color={color} />
    </group>
)

const MainIsland = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3} floatingRange={[-0.1, 0.1]}>
      <group>
        {/* --- TERRAIN GEOMETRY --- */}
        
        {/* 1. Rocky Underside (Composite) */}
        <group position={[0, -2, 0]}>
             {/* Main Cone */}
            <mesh receiveShadow>
                <coneGeometry args={[3.5, 4.5, 8]} />
                <meshStandardMaterial color="#334155" flatShading roughness={0.8} />
            </mesh>
            {/* Extra layers to make it jagged */}
            <mesh position={[0.5, 0.5, 0.5]} rotation={[0.1, 0, 0.2]}>
                 <coneGeometry args={[3.0, 3.5, 7]} />
                 <meshStandardMaterial color="#1e293b" flatShading roughness={0.8} />
            </mesh>
             <mesh position={[-0.5, 0.2, -0.5]} rotation={[-0.1, 0, -0.2]}>
                 <coneGeometry args={[3.2, 3.8, 6]} />
                 <meshStandardMaterial color="#475569" flatShading roughness={0.8} />
            </mesh>
        </group>

        <CliffDetails />
        <HangingRoots />
        <CrystalRoots />

        {/* 2. Main Soil Layer */}
        <mesh position={[0, 0, 0]} receiveShadow>
           <cylinderGeometry args={[3.8, 3.5, 1.5, 8]} />
           <meshStandardMaterial color="#475569" flatShading roughness={0.9} />
        </mesh>
        
        {/* 3. Grass Top Layer */}
        <mesh position={[0, 0.76, 0]} receiveShadow>
           <cylinderGeometry args={[3.9, 3.8, 0.25, 8]} />
           <meshStandardMaterial color="#365314" flatShading roughness={1} />
        </mesh>
        
        <Vegetation />
        <Bushes />
        <Pebbles />
        <Mushrooms />
        <Pathway />
        <RimRocks />
        <GuardianStones />

        {/* 4. Uneven Ground Patches */}
        <mesh position={[1.5, 0.8, 1]} rotation={[-0.1, 0, 0]} receiveShadow>
            <cylinderGeometry args={[1.2, 1.5, 0.3, 5]} />
            <meshStandardMaterial color="#4d7c0f" flatShading />
        </mesh>


        {/* --- WATER FEATURES --- */}

        {/* Pond Bed */}
        <mesh position={[2.2, 0.8, 0]} rotation={[0, 0, 0]}>
           <cylinderGeometry args={[1.4, 1.2, 0.3, 7]} />
           <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Water Surface */}
        <mesh position={[2.2, 0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <circleGeometry args={[1.2, 32]} />
           <MeshDistortMaterial 
                color="#22d3ee" 
                speed={2} 
                distort={0.2} 
                radius={1}
                roughness={0.1}
                metalness={0.5}
           />
        </mesh>
        
        {/* Water Foam Rim */}
        <mesh position={[2.2, 0.97, 0]} rotation={[-Math.PI / 2, 0, 0]}>
           <ringGeometry args={[1.15, 1.25, 32]} />
           <meshBasicMaterial color="#cffafe" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>

        <LilyPads />

        {/* Waterfall Flow Mesh */}
        <mesh position={[3.2, -1.5, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.6, 5, 0.8]} />
            <MeshDistortMaterial 
                color="#67e8f9" 
                speed={4} 
                distort={0.4} 
                transparent 
                opacity={0.6} 
            />
        </mesh>

        <WaterfallParticles />
        
        {/* Waterfall Mist */}
        <Cloud position={[3.2, -4.5, 0]} opacity={0.6} bounds={[2, 1.5, 2]} volume={4} color="#ecfeff" speed={0.8} />


        {/* --- SCENERY OBJECTS --- */}

        {/* Character and Magic */}
        <MeditatingGirl />
        <MagicCircle />
        <FloatingRunes />
        <Fireflies />

        {/* Ruins */}
        <RuinArch position={[-1.5, 1.1, 1.5]} rotation={[0, -0.5, 0]} />

        {/* Trees - More variety */}
        <DetailedTree position={[-0.5, 0.9, 2]} scale={1.2} color="#166534" />
        <DetailedTree position={[-2.5, 1.1, -1]} scale={1.6} color="#14532d" />
        <DetailedTree position={[-1, 1, -2.2]} scale={1.8} color="#15803d" />
        <DetailedTree position={[0.5, 0.9, -2]} scale={1.1} color="#4d7c0f" />
        <DetailedTree position={[2.2, 0.9, -1.5]} scale={0.9} color="#365314" />
        <DetailedTree position={[-2.8, 0.9, 1.5]} scale={1.0} color="#166534" />

        {/* Main Crystal (Lifted higher to float above character) */}
        <Crystal position={[0, 3, 0]} scale={1.5} color="#cffafe" />
        <pointLight position={[0, 3, 0]} distance={8} intensity={5} color="#22d3ee" />
        
        {/* Subtle light on character */}
        <spotLight position={[2, 4, 2]} angle={0.5} penumbra={1} intensity={4} color="#fff7ed" castShadow target-position={[0,1,0]} />

        {/* Small Crystals */}
        <Crystal position={[2.2, 1.1, 0.8]} scale={0.4} />
        <Crystal position={[1.8, 1.1, -0.5]} scale={0.5} />
        
        {/* Magic Rings */}
        <MagicRings />

      </group>
    </Float>
  );
};

const FloatingDebris = () => {
  const debris = useMemo(() => {
    return Array.from({ length: 40 }).map(() => {
      return {
        position: [
          (Math.random() - 0.5) * 25, 
          (Math.random() * 12) - 6, 
          (Math.random() - 0.5) * 18
        ] as [number, number, number],
        scale: Math.random() * 0.6 + 0.1,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        speed: Math.random() * 0.01
      };
    });
  }, []);

  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
      if (ref.current) {
          ref.current.rotation.y += 0.0005;
      }
  });

  return (
    <group ref={ref}>
      {debris.map((d, i) => (
        <mesh key={i} position={d.position} rotation={d.rotation} scale={d.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const IslandScene = () => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas shadows camera={{ position: [0, 2, 12], fov: 45 }}>
        {/* --- Lighting --- */}
        <ambientLight intensity={0.4} color="#1e293b" />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={2.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
          color="#fcd34d" // Golden hour sunlight
        />
        <pointLight position={[-5, 2, -5]} intensity={1} color="#38bdf8" /> {/* Blue rim light */}
        <pointLight position={[0, -4, 0]} intensity={1} color="#4ade80" /> {/* Green bounce from below */}
        
        {/* --- Environment --- */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Cloud opacity={0.3} speed={0.2} bounds={[20, 2, 5]} segments={20} position={[0, -5, -10]} color="#64748b" />
        <Cloud opacity={0.2} speed={0.3} bounds={[20, 2, 5]} segments={20} position={[0, 5, -10]} color="#94a3b8" />
        <Environment preset="sunset" blur={0.6} background={false} />
        
        {/* --- Scene Content --- */}
        <group position={[0, -1, 0]}>
            <MainIsland />
            {/* MiniIsland removed */}
        </group>
        
        <FloatingDebris />
        <Sparkles count={200} scale={15} size={3} speed={0.4} opacity={0.4} color="#e0f2fe" />

        {/* --- Controls --- */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={6}
          maxDistance={18}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
