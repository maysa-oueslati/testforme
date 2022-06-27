import React, { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { Html } from '@react-three/drei';
import { useSpring, a as a3f } from '@react-spring/three';
import { animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useThree } from '@react-three/fiber';

/** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';

export function AImage({ document, onChange, onDelete }: any) {
  const { id, activityId, content, cfg } = document;
  const [value, setValue] = useState<string>(content || 'Texte..');

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: cfg?.style?.width || 200,
    height: cfg?.style?.height || 30,
  });

  const [position, setPosition] = useState<any>(cfg?.position || [0, 0, 1]);
  const [scale, setScale] = useState<any>(cfg?.scale || [1, 1, 1]);
  const [rotation, setRotation] = useState<any>(cfg?.rotation || [0, 0, 0]);

  const [spring, api] = useSpring<any>(() => ({
    rot: rotation || [0, 0, 0],
    scale: scale || [1, 1, 1],
    position: position || [3, 0, 1],
  }));

  const { viewport } = useThree();
  const { factor } = viewport;

  useEffect(() => {
    onChange({
      id,
      activityId,
      content: value,
      cfg: {
        style: {
          width: size.width,
          height: size.height,
        },
        position,
        scale,
        rotation,
      },
    });
  }, [value, position, scale, rotation, size]);

  const gesture = useGesture(
    {
      // onDoubleClick: (event) => {
      //   console.log('dblclick', event);
      // },
      // onMove: ({ event }) => console.log('move', event),
      onDragEnd: ({ offset: [x, y] }) => {
        setPosition([x / factor, -y / factor, 1]);
      },
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel();
        api.start({
          position: [x / factor, -y / factor, 1],
        });
      },
      onPinch: ({ memo }) => {
        /*
        {
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }*/

        // if (first) {
        //   const { width, height, x, y } = ref.current.getBoundingClientRect();
        //   const tx = ox - (x + width / 2);
        //   const ty = oy - (y + height / 2);
        //   memo = [p.x.get(), style.y.get(), tx, ty];
        // }

        // const x = memo[0] - (ms - 1) * memo[2];
        // const y = memo[1] - (ms - 1) * memo[3];
        // api.start({ scale: s, rotateZ: a, x, y });
        return memo;
      },
    },
    {
      // target: mesh,
      drag: { delay: false },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: false },
    },
  );

  return (
    <a3f.mesh {...spring}>
      <Html>
        <animated.div
          {...gesture()}
          css={{
            width: '100%',
            height: '100%',
            touchAction: 'none',
            display: 'flex',
            border: '2px dashed hotpink',
          }}>
          <Zoom wrapStyle={{ zIndex: 0 }}>
            <img
              style={{ zIndex: 0 }}
              alt='that wanaka tree'
              src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
              width={200}
              height={200}
            />
          </Zoom>
          {onDelete && (
            <Button
              onClick={onDelete}
              type='link'
              icon={<DeleteOutlined />}
            />
          )}
        </animated.div>
      </Html>
    </a3f.mesh>
  );
}
