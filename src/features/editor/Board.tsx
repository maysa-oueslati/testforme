import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

import { Button } from 'antd';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import VideoStableOutlinedIcon from '@mui/icons-material/VideoStableOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';

import { RxProvider } from '../../app/db/RxProvider';

import useStore from '../../app/store';
import useLogger from '../../app/logger';

import { Center3f, ImagePreview3f } from '../../app/components';
import { ARAnchor, ARView } from '../arview';
import { Steps3f } from './Steps3f';
import { Aura } from '../auras';
import MkUpload from '../markerUpload/MkUpload';

function Content() {
  const log = useLogger('Board:Content');
  const { viewport, size } = useThree();

  const ref = useRef<any>();

  const startTracking = () => ref.current.startTracking();
  const stopTracking = () => ref.current.stopTracking();
  const startCamera = () => ref.current.startCamera();
  const stopCamera = () => ref.current.stopCamera();
  const switchCamera = () => ref.current.switchCamera();

  const compiling = useStore((state) => state.mkUploadSlice.compiling);
  const setCompiling = useStore((state) => state.mkUploadSlice.setCompiling);
  const markerImages = useStore((state) => state.mkUploadSlice.markerImages);
  const markerFile = useStore((state) => state.mkUploadSlice.markerFile);

  const tracking = useStore((state) => state.editorSlice.tracking);
  const setTracking = useStore((state) => state.editorSlice.setTracking);

  const auras = useStore((state) => state.activitySlice.auras);
  const addAura = useStore((state) => state.activitySlice.addAura);
  const removeAura = useStore((state) => state.activitySlice.removeAura);
  const updateAura = useStore((state) => state.activitySlice.updateAura);

  const [markerUrl, setMarkerUrl] = useState<string>('');

  const stepHeight = 46;
  const stepHeightUnit = (stepHeight * viewport.height) / size.height;

  const handleChange = (document) => {
    log.debug('handleChange', document);
  };

  const handleDelete = (document) => {
    log.debug('handleDelete', document);
    removeAura(document?.id);
  };

  useEffect(() => {
    // @ts-ignore
    const db = window['db'];

    async function getAttachment() {
      if (!db) return;

      const doc = await db.activities
        .findOne({
          selector: {
            title: 'activity-1',
          },
        })
        .exec();

      const attachment = doc.getAttachment(markerFile);

      const blobBuffer = await attachment.getData();

      const url = window.URL.createObjectURL(blobBuffer);

      if (markerUrl) {
        window.URL.revokeObjectURL(markerUrl);
      }

      log.debug('attachment', attachment);

      setMarkerUrl(url);
    }

    getAttachment();
  }, [markerFile]);

  const steps = [
    {
      title: 'Marqueur',
      description: 'Ajouter votre image marqueur',
      content: (
        <Center3f
          viewport={viewport}
          top={stepHeightUnit}>
          <Html
            center
            style={{
              width: size.width / 2,
              height: size.height / 3,
            }}>
            <MkUpload multiple={false} />
          </Html>
        </Center3f>
      ),
      actions: [
        !markerFile && (
          <Button
            key='upload'
            size='large'
            shape='round'
            type='primary'
            disabled={markerImages?.length === 0}
            loading={compiling}
            icon={<FileUploadOutlinedIcon />}
            onClick={() => setCompiling(true)}>
            Charger
          </Button>
        ),
      ],
      await: false, //compiling || !markerFile,
    },
    {
      title: 'Augmentation',
      description: 'Ajouter vos augmentations',
      content: (
        <Center3f viewport={viewport}>
          {/* Activity Auras */}

          {auras.map((document) => (
            <Aura
              key={document.id}
              document={document}
              onChange={handleChange}
              onDelete={handleDelete.bind(null, document)}
            />
          ))}

          {/* Marker Preview */}
          {markerImages?.map((file) => (
            <ImagePreview3f
              key={file.uid}
              file={file}
              transparent
              opacity={1}
              needsUpdate={true}
              scale={[viewport.width, viewport.height - 2 * stepHeightUnit, 1]}
            />
          ))}
        </Center3f>
      ),
    },
    {
      title: 'Essai',
      description: 'Essayer votre activité',
      content: (
        <Center3f viewport={viewport}>
          <ARView
            ref={ref}
            autoplay={false}
            autocam={false}
            imageTargets={markerUrl}
            // filterMinCF={0}
            // filterBeta={1000}
            // missTolerance={5}
            // warmupTolerance={5}
            maxTrack={2}>
            <ARAnchor target={0}>
              {/* Activity Auras */}

              <group>
                {auras.map((document) => (
                  <Aura
                    key={document.id}
                    document={document}
                    onChange={handleChange}
                    onDelete={null}
                  />
                ))}

                <mesh>
                  <boxGeometry args={[1, 1, 0.1]} />
                  <meshStandardMaterial color='orange' />
                </mesh>

                {/* Marker Preview */}
                {/* {markerImages?.map((file) => (
                  <ImagePreview3f
                    key={file.uid}
                    file={file}
                    transparent
                    opacity={1}
                    needsUpdate={true}
                    scale={[2, 2, 1]}
                  />
                ))} */}
              </group>
            </ARAnchor>
          </ARView>
        </Center3f>
      ),
      actions: [
        tracking && (
          <Button
            key='switch'
            size='large'
            shape='round'
            icon={<CameraswitchOutlinedIcon />}
            onClick={() => switchCamera()}>
            Caméra
          </Button>
        ),
        tracking && (
          <Button
            key='stop'
            size='large'
            shape='round'
            type='primary'
            icon={<CancelPresentationOutlinedIcon />}
            onClick={() => {
              setTracking(false);
              stopCamera();
              setTimeout(() => {
                stopTracking();
              }, 1000);
            }}>
            Arrêter
          </Button>
        ),
        !tracking && (
          <Button
            key='start'
            size='large'
            shape='round'
            type='primary'
            icon={<VideoStableOutlinedIcon />}
            onClick={() => {
              setTracking(true);
              startCamera();
              setTimeout(() => {
                startTracking();
              }, 3000);
            }}>
            Démarrer
          </Button>
        ),
      ],
    },
  ];

  return <Steps3f steps={steps} />;
}

export default function Board3f() {
  return (
    <Canvas
      // legacy={true}
      // gl={{ alpha: false, physicallyCorrectLights: true }}
      style={{ height: '98%', background: 'none' }}>
      <ambientLight />

      <RxProvider>
        <Suspense fallback={null}>
          <Content
          // startTracking={startTracking}
          // stopTracking={stopTracking}
          // switchCamera={switchCamera}
          // startCamera={startCamera}
          // stopCamera={stopCamera}
          />
        </Suspense>
      </RxProvider>
    </Canvas>
  );
}
