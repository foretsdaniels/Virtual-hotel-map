declare module '@mkkellogg/gaussian-splats-3d' {
  export class Viewer {
    constructor(options?: {
      cameraUp?: number[];
      initialCameraPosition?: number[];
      initialCameraLookAt?: number[];
      rootElement?: HTMLElement;
      dynamicScene?: boolean;
      sharedMemoryForWorkers?: boolean;
      selfDrivenMode?: boolean;
      [key: string]: unknown;
    });
    camera: import('three').PerspectiveCamera;
    addSplatScene(
      url: string,
      options?: {
        splatAlphaRemovalThreshold?: number;
        showLoadingUI?: boolean;
        position?: number[];
        rotation?: number[];
        scale?: number[];
        [key: string]: unknown;
      }
    ): Promise<void>;
    start(): void;
    dispose(): void;
    update(): void;
  }
}
