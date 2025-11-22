/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    cylinderGeometry: any;
    meshBasicMaterial: any;
    dodecahedronGeometry: any;
    meshStandardMaterial: any;
    pointLight: any;
    coneGeometry: any;
    planeGeometry: any;
    circleGeometry: any;
    sphereGeometry: any;
    instancedMesh: any;
    octahedronGeometry: any;
    boxGeometry: any;
    capsuleGeometry: any;
    torusGeometry: any;
    ringGeometry: any;
    ambientLight: any;
    directionalLight: any;
    spotLight: any;
  }
}
