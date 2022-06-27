import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  faces as FaceMeshFaces,
  uvs as FaceMeshUVs,
} from 'mind-ar/src/face-target/face-geometry/face-data';
import { Matrix4, Quaternion, Vector3 } from 'three';

import { atom, useAtom } from 'jotai';

import { Controller as FaceTargetController } from 'mind-ar/src/face-target/controller';
import { Html } from '@react-three/drei';
import { Controller as ImageTargetController } from 'mind-ar/src/image-target/controller';
import Webcam from 'react-webcam';
import { useUpdateAtom } from 'jotai/utils';

const anchorsAtom = atom([]);
const faceMeshesAtom = atom([]);

const ARProvider = forwardRef(
  (
    {
      children,
      autoplay,
      autocam,
      imageTargets,
      maxTrack,
      filterMinCF = null,
      filterBeta = null,
      warmupTolerance = null,
      missTolerance = null,
    }: any,
    ref: any,
  ) => {
    const [isWebcamFacingUser, switchCamera] = useState(!Boolean(imageTargets));
    const webcamRef = useRef<any>(null);
    const [ready, setReady] = useState(false);
    const [cameraReady, setCameraReady] = useState(autocam);
    const controllerRef = useRef<any>(null);
    const { camera, size } = useThree<any>();
    const [anchors] = useAtom(anchorsAtom);
    const [faceMeshes] = useAtom(faceMeshesAtom);

    const { width, height } = size; //useWindowSize();

    const isLandscape = useMemo(() => height <= width, [height, width]);
    const ratio = useMemo(
      () => (isLandscape ? width / height : height / width),
      [isLandscape, width, height],
    );

    useEffect(() => {
      if (controllerRef.current) {
        if (imageTargets) {
          const ARprojectionMatrix =
            controllerRef.current.getProjectionMatrix();
          camera.fov =
            (2 * Math.atan(1 / ARprojectionMatrix[5]) * 180) / Math.PI;
          camera.near = ARprojectionMatrix[14] / (ARprojectionMatrix[10] - 1.0);
          camera.far = ARprojectionMatrix[14] / (ARprojectionMatrix[10] + 1.0);
          camera.updateProjectionMatrix();
        }
      }
    }, [width, height, camera, imageTargets]);

    const handleStream = useCallback(() => {
      if (webcamRef.current) {
        webcamRef.current.video.addEventListener('loadedmetadata', () =>
          setReady(true),
        );
      }
    }, [webcamRef]);

    const startTracking = useCallback(async () => {
      if (ready) {
        let controller;
        if (imageTargets) {
          controller = new ImageTargetController({
            inputWidth: webcamRef.current.video.videoWidth,
            inputHeight: webcamRef.current.video.videoHeight,
            maxTrack,
            filterMinCF,
            filterBeta,
            missTolerance,
            warmupTolerance,
          });

          const { dimensions: imageTargetDimensions } =
            await controller.addImageTargets(imageTargets);

          const postMatrices = imageTargetDimensions.map(
            ([markerWidth, markerHeight]) =>
              new Matrix4().compose(
                new Vector3(
                  markerWidth / 2,
                  markerWidth / 2 + (markerHeight - markerWidth) / 2,
                ),
                new Quaternion(),
                new Vector3(markerWidth, markerWidth, markerWidth),
              ),
          );

          const ARprojectionMatrix = controller.getProjectionMatrix();
          camera.fov =
            (2 * Math.atan(1 / ARprojectionMatrix[5]) * 180) / Math.PI;
          camera.near = ARprojectionMatrix[14] / (ARprojectionMatrix[10] - 1.0);
          camera.far = ARprojectionMatrix[14] / (ARprojectionMatrix[10] + 1.0);
          camera.updateProjectionMatrix();

          controller.onUpdate = (data) => {
            if (data.type === 'updateMatrix') {
              const { targetIndex, worldMatrix } = data;

              anchors.forEach(
                ({ anchor, target, onAnchorFound, onAnchorLost }: any) => {
                  if (target === targetIndex) {
                    if (
                      !anchor.visible &&
                      worldMatrix !== null &&
                      onAnchorFound
                    )
                      onAnchorFound();
                    else if (
                      anchor.visible &&
                      worldMatrix === null &&
                      onAnchorLost
                    )
                      onAnchorLost();

                    anchor.visible = worldMatrix !== null;

                    if (worldMatrix !== null) {
                      anchor.matrix = new Matrix4()
                        .fromArray([...worldMatrix])
                        .multiply(postMatrices[targetIndex]);
                    }
                  }
                },
              );
            }
          };
        } else {
          controller = new FaceTargetController({
            filterMinCF,
            filterBeta,
          });

          controller.onUpdate = ({ hasFace, estimateResult }: any) => {
            faceMeshes.forEach(({ anchor, onFaceFound, onFaceLost }: any) => {
              if (!anchor.visible && hasFace && onFaceFound) onFaceFound();
              else if (anchor.visible && !hasFace && onFaceLost) onFaceLost();

              anchor.visible = hasFace;
            });

            anchors.forEach(
              ({ anchor, target, onAnchorFound, onAnchorLost }: any) => {
                if (!anchor.visible && hasFace && onAnchorFound)
                  onAnchorFound();
                else if (anchor.visible && !hasFace && onAnchorLost)
                  onAnchorLost();

                anchor.visible = hasFace;
                if (hasFace)
                  anchor.matrix.set(...controller.getLandmarkMatrix(target));
              },
            );

            if (hasFace)
              faceMeshes.forEach(({ anchor }: any) => {
                anchor.matrix.set(...estimateResult.faceMatrix);

                for (let i = 0; i < FaceMeshUVs.length; i++)
                  anchor.geometry.attributes.position.set(
                    estimateResult.metricLandmarks[i],
                    i * 3,
                  );

                anchor.geometry.attributes.position.needsUpdate = true;
                anchor.geometry.computeVertexNormals();
              });
          };

          await controller.setup(webcamRef.current.video);

          const { fov, aspect, near, far } = controller.getCameraParams();
          camera.fov = fov;
          camera.aspect = aspect;
          camera.near = near;
          camera.far = far;
          camera.updateProjectionMatrix();
        }

        await controller.dummyRun(webcamRef.current.video);

        controller.processVideo(webcamRef.current.video);

        controllerRef.current = controller;
      }
    }, [
      ready,
      imageTargets,
      maxTrack,
      filterMinCF,
      filterBeta,
      missTolerance,
      warmupTolerance,
      camera,
      anchors,
      faceMeshes,
    ]);

    const stopTracking = useCallback(() => {
      if (controllerRef.current) {
        controllerRef.current.stopProcessVideo();
      }
    }, [controllerRef]);

    const startCamera = useCallback(() => {
      setCameraReady(true);
    }, [cameraReady]);

    const stopCamera = useCallback(() => {
      setCameraReady(false);
    }, [cameraReady]);

    useFrame(() => {
      if (controllerRef.current && !controllerRef.current.processingVideo) {
        faceMeshes.forEach(({ anchor }: any) => (anchor.visible = false));
        anchors.forEach(({ anchor }: any) => (anchor.visible = false));
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        startTracking,
        stopTracking,
        startCamera,
        stopCamera,
        switchCamera: () => {
          const wasTracking =
            controllerRef.current && controllerRef.current.processingVideo;
          wasTracking && stopTracking();
          setReady(false);
          switchCamera((isWebcamFacingUser) => !isWebcamFacingUser);
          wasTracking && startTracking();
        },
      }),
      [startTracking, stopTracking],
    );

    useEffect(() => {
      if (ready && autoplay) {
        startTracking();
      }
    }, [autoplay, ready, startTracking]);

    return (
      <>
        <Html
          // center
          // fullscreen
          zIndexRange={[-1, -1]}
          calculatePosition={() => [0, 0]}
          style={{ top: 0, left: 0, width: size.width, height: size.height }}
          className='webcam'>
          {cameraReady && (
            <Webcam
              ref={webcamRef}
              onUserMedia={handleStream}
              height={size.height}
              width={size.width}
              videoConstraints={{
                facingMode: isWebcamFacingUser ? 'user' : 'environment',
                aspectRatio: ratio,
              }}
            />
          )}
        </Html>
        {children}
      </>
    );
  },
);

const ARView = forwardRef(
  (
    {
      children,
      autoplay = true,
      autocam = false,
      imageTargets,
      maxTrack = 1,
      filterMinCF,
      filterBeta,
      warmupTolerance,
      missTolerance /*,...rest*/,
    }: any,
    ref: any,
  ) => {
    // const canvasRef = useRef<any>(null);
    const ARRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      startTracking: () => ARRef?.current?.startTracking(),
      stopTracking: () => ARRef?.current?.stopTracking(),
      switchCamera: () => ARRef?.current?.switchCamera(),
      startCamera: () => ARRef?.current?.startCamera(),
      stopCamera: () => ARRef?.current?.stopCamera(),
      // current: canvasRef.current,
    }));

    return (
      <ARProvider
        {...{
          autoplay,
          autocam,
          imageTargets,
          maxTrack,
          filterMinCF,
          filterBeta,
          warmupTolerance,
          missTolerance,
        }}
        ref={ARRef}>
        {children}
      </ARProvider>
    );
  },
);

const ARAnchor = ({
  children,
  target = 0,
  onAnchorFound,
  onAnchorLost,
  ...rest
}: any) => {
  const ref = useRef<any>();
  const setAnchors: any = useUpdateAtom(anchorsAtom);

  useEffect(() => {
    if (ref.current)
      setAnchors((anchors: any) => [
        ...anchors,
        { target, anchor: ref.current, onAnchorFound, onAnchorLost },
      ]);
  }, [ref, setAnchors, target, onAnchorFound, onAnchorLost]);

  return (
    <group
      ref={ref}
      visible={false}
      matrixAutoUpdate={false}
      {...rest}>
      {children}
    </group>
  );
};

const ARFaceMesh = ({ children, onFaceFound, onFaceLost, ...rest }: any) => {
  const ref = useRef<any>();
  const setFaceMeshes: any = useUpdateAtom(faceMeshesAtom);

  const [positions, uvs, indexes] = useMemo(() => {
    const positions = new Float32Array(FaceMeshUVs.length * 3);
    const uvs = new Float32Array(FaceMeshUVs.length * 2);
    const indexes = new Uint32Array(FaceMeshFaces);
    for (let i = 0; i < FaceMeshUVs.length; i++) {
      uvs[i * 2] = FaceMeshUVs[i][0];
      uvs[i * 2 + 1] = FaceMeshUVs[i][1];
    }

    return [positions, uvs, indexes];
  }, []);

  useEffect(() => {
    if (ref.current)
      setFaceMeshes((faceMeshes: any) => [
        ...faceMeshes,
        { anchor: ref.current, onFaceFound, onFaceLost },
      ]);
  }, [ref, setFaceMeshes, onFaceFound, onFaceLost]);

  return (
    <mesh
      ref={ref}
      visible={false}
      matrixAutoUpdate={false}
      {...rest}>
      <bufferGeometry attach='geometry'>
        <bufferAttribute
          attach='index'
          array={indexes}
          count={indexes.length}
          itemSize={1}
        />
        <bufferAttribute
          // @ts-ignore
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />

        <bufferAttribute
          // @ts-ignore
          attachObject={['attributes', 'uv']}
          count={uvs.length / 2}
          itemSize={2}
          array={uvs}
        />
      </bufferGeometry>
      {children}
    </mesh>
  );
};

export { ARView, ARAnchor, ARFaceMesh };
