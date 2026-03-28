import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import type { SplatScene } from '../../types';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';

interface Props {
  scene: SplatScene;
  onHotspotClick?: (hotspotId: string) => void;
}

export function SplatViewer({ scene, onHotspotClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof GaussianSplats3D.Viewer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const initCamera = useCallback(() => {
    return {
      position: scene.cameraPosition ?? [0, 1.5, 3],
      target: scene.cameraTarget ?? [0, 0, 0],
    };
  }, [scene.cameraPosition, scene.cameraTarget]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoading(true);
    setError(null);

    const cam = initCamera();

    let viewer: InstanceType<typeof GaussianSplats3D.Viewer> | null = null;

    const init = async () => {
      try {
        viewer = new GaussianSplats3D.Viewer({
          cameraUp: [0, -1, 0],
          initialCameraPosition: cam.position,
          initialCameraLookAt: cam.target,
          rootElement: container,
          dynamicScene: false,
          sharedMemoryForWorkers: false,
        });

        viewerRef.current = viewer;

        await viewer.addSplatScene(scene.splatUrl, {
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: false,
          position: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1, 1, 1],
        });

        viewer.start();
        setLoading(false);
      } catch (err) {
        console.error('Splat viewer init error:', err);
        setError('Could not load 3D scene. The splat file may not be available yet.');
        setLoading(false);
      }
    };

    init();

    return () => {
      if (viewer) {
        try {
          viewer.dispose();
        } catch {
          // ignore cleanup errors
        }
      }
      viewerRef.current = null;
    };
  }, [scene.splatUrl, scene.id, initCamera]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const resetCamera = useCallback(() => {
    // Reset by re-mounting
    const container = containerRef.current;
    if (!container || !viewerRef.current) return;
    const cam = initCamera();
    const viewer = viewerRef.current;
    try {
      if (viewer.camera) {
        viewer.camera.position.set(...(cam.position as [number, number, number]));
        viewer.camera.lookAt(new THREE.Vector3(...(cam.target as [number, number, number])));
      }
    } catch {
      // fallback: do nothing
    }
  }, [initCamera]);

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[500px]">
      <div ref={containerRef} className="splat-viewer-container w-full h-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/70 text-sm">Loading 3D scene...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-lg">
          <div className="text-center px-6 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-navy/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3D</span>
            </div>
            <p className="text-white/90 text-sm font-medium mb-2">3D Tour Preview</p>
            <p className="text-white/50 text-xs">{error}</p>
            <p className="text-white/30 text-xs mt-3">
              Place .splat files in <code className="bg-white/10 px-1 rounded">{scene.splatUrl}</code>
            </p>
          </div>
        </div>
      )}

      {/* Hotspot markers (projected to 2D from yaw/pitch) */}
      {!loading && !error && scene.hotspots.map(hs => {
        // Convert yaw/pitch to approximate screen position
        const xPercent = ((hs.yaw + 180) % 360) / 360 * 100;
        const yPercent = (90 - hs.pitch) / 180 * 100;
        return (
          <button
            key={hs.id}
            className="hotspot-marker"
            style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
            onClick={() => onHotspotClick?.(hs.id)}
            title={hs.title}
          >
            <div className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center border-2 border-teal">
              <div className="w-3 h-3 rounded-full bg-teal" />
            </div>
          </button>
        );
      })}

      {/* Controls */}
      {!loading && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={resetCamera}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white/80 hover:text-white transition-colors backdrop-blur-sm"
            title="Reset camera"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white/80 hover:text-white transition-colors backdrop-blur-sm"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
