# 🏝️ Celestia Falls: Procedural 3D Fantasy Explorer

**Celestia Falls** is a high-performance, procedurally generated 3D environment running entirely in the browser. This project demonstrates advanced WebGL techniques using the React ecosystem to create an immersive fantasy floating island **without relying on external 3D model assets**.

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

🔗 **Live Demo:** [https://island3-d-kappa.vercel.app](https://island3-d-kappa.vercel.app)

## 🚀 Technical Highlights

Unlike typical 3D websites that load heavy `.gltf` or `.obj` files, this scene is **100% generated via code**. This approach demonstrates mastery over:

*   **Procedural Generation**: Every rock, tree, and blade of grass is placed mathematically using algorithms.
*   **Performance Optimization**: Utilizes **Instanced Mesh Rendering** (`<Instances />`) to render over **2,500+ objects** (grass, pebbles) with a single GPU draw call, ensuring stable 60 FPS.
*   **Custom Shaders**: Implementation of `MeshDistortMaterial` to create reactive, rippling water effects without heavy physics simulations.
*   **Math-based Animation**: All animations (floating, rotating rings, swaying lanterns) are calculated in real-time using trigonometric functions (Sine/Cosine waves).

## 🛠️ Tech Stack

### Core
*   ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) **React 18**: Component-based UI and state management.
*   ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white) **TypeScript**: Type-safe code for robust development.
*   ![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white) **Vite**: Next-generation frontend tooling.

### 3D & Graphics
*   ![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white) **Three.js**: The core 3D library.
*   **@react-three/fiber (R3F)**: React renderer for Three.js (Declarative scene graph).
*   **@react-three/drei**: High-level abstractions for environment, sparkles, and controls.

### Styling
*   ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS**: Utility-first styling for the UI overlay.

## ✨ Visual Features Implemented

1.  **Complex Terrain Geometry**:
    *   Composite meshes creating jagged cliff faces.
    *   Tiered vegetation layers.
2.  **Atmospheric Effects**:
    *   "Golden Hour" HDRI Environment lighting.
    *   Volumetric Clouds and Mist using noise textures.
    *   Custom Firefly particle system.
3.  **Interactive Elements**:
    *   OrbitControls with damping for smooth camera movement.
    *   Reactive lighting that reflects off the water surface.
4.  **Dynamic Details**:
    *   Meditating character with levitation animation.
    *   Rotating magical runes and mana rings.
    *   Swaying lanterns attached to procedural trees.

## 📂 Project Structure

```bash
src/
├── components/
│   ├── IslandScene.tsx   # The core 3D logic & procedural generation
│   └── UIOverlay.tsx     # Minimalist UI layer
├── services/             # API integrations (Gemini AI ready)
├── App.tsx               # Main entry point
└── main.tsx
```

## 📦 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/celestia-falls-3d.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run local server:**
    ```bash
    npm run dev
    ```

---

*Created for the Frontend/Creative Developer Portfolio.*