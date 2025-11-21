# 🏝️ Celestia Falls: Procedural 3D Fantasy Island

**Celestia Falls** is an immersive, real-time 3D visual experience built with React and WebGL. It features a procedurally generated floating island with a reactive water system, atmospheric lighting, and dynamic particle effects—all generated via code without external 3D models.

🔗 **Live Demo:** [https://island3-d-kappa.vercel.app](https://island3-d-kappa.vercel.app)

![Celestia Falls Screenshot](https://island3-d-kappa.vercel.app/screenshot.png) *Note: Add a screenshot to your repo named screenshot.png*

## ✨ Key Features

*   **Procedural Geometry:** Every rock, tree, grass blade, and ruin is constructed mathematically using primitive shapes and instanced meshes.
*   **Reactive Water Shader:** Custom implementation of `MeshDistortMaterial` to create magical, rippling water effects for the pond and waterfall.
*   **High-Performance Rendering:** Utilizes `<Instances />` from `@react-three/drei` to render over 2,500 grass blades and hundreds of pebbles with a single draw call, ensuring 60 FPS.
*   **Atmospheric Environment:** Features volumetric clouds, "Golden Hour" HDRI lighting, and custom particle systems for fireflies and mist.
*   **Dynamic Elements:** Animated character (Lotus position), floating runes, rotating mana rings, and swaying lanterns.

## 🛠️ Tech Stack

*   **Framework:** React 18, Vite
*   **Language:** TypeScript
*   **3D Engine:** Three.js
*   **React 3D Abstractions:** @react-three/fiber, @react-three/drei
*   **Styling:** Tailwind CSS

## 🚀 Getting Started

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

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

*   `src/components/IslandScene.tsx`: The core 3D logic containing the procedural island generation.
*   `src/App.tsx`: Main application entry point.
*   `src/components/UIOverlay.tsx`: The minimalist UI layer.

## 🎨 Design Philosophy

The project aims to prove that high-fidelity, artistic 3D scenes can be created on the web purely through code composition, reducing the need for large asset downloads and allowing for infinite variations.

---

*Created by [Your Name]*