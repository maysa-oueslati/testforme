import React, { useCallback, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSpring, a as a3f } from '@react-spring/three';
import { animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { Resizable } from 're-resizable';

import { Typography, Button } from 'antd';
import {
  FontColorsOutlined,
  FontSizeOutlined,
  HighlightOutlined,
  LineHeightOutlined,
  ItalicOutlined,
  BoldOutlined,
  AlignCenterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

/** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';

import useControls from '../controls/controls';

const options = [
  {
    component: 'Select',
    label: 'fontFamily',
    key: 'fontFamily',
    defaultValue: 'Arial',
    width: 100,
    size: 'large',
    options: [
      { label: 'Arial', value: 'Arial' },
      { label: 'Verdana', value: 'Verdana' },
      { label: 'Helvetica', value: 'Sans-serif' },
      { label: 'Optima', value: 'Optima' },
      { label: 'Brush Script MT', value: 'Brush Script MT' },
      { label: 'Times New Roman', value: 'Times New Roman' },
    ],
    description: '',
  },
  {
    component: 'Select',
    icon: <FontSizeOutlined />,
    name: 'fontSize',
    label: 'Taille',
    key: 'fontSize',
    size: 'large',
    width: 72,
    defaultValue: 18,
    options: [
      { label: '10', value: 10 },
      { label: '12', value: 12 },
      { label: '14', value: 14 },
      { label: '18', value: 18 },
      { label: '24', value: 24 },
      { label: '36', value: 36 },
      { label: '48', value: 48 },
      { label: '64', value: 64 },
      { label: '80', value: 80 },
      { label: '144', value: 144 },
      { label: '288', value: 288 },
    ],
    max: 900,
    min: 5,
    description: '',
  },
  {
    component: 'InputColor',
    icon: <FontColorsOutlined />,
    width: 46,
    label: 'color',
    key: 'color',
    defaultValue: '#000',
    size: 'large',
    description: '',
  },
  {
    component: 'InputColor',
    icon: <HighlightOutlined />,
    width: 46,
    label: 'background',
    key: 'background',
    defaultValue: 'rgba(0, 0, 0, 0.5)',
    size: 'large',
    description: '',
  },
  {
    component: 'RadioButton',
    icon: <AlignCenterOutlined />,
    width: 46,
    label: 'textAlign',
    key: 'textAlign',
    defaultValue: 'start',
    size: 'large',
    options: [
      { label: 'Start', value: 'start' },
      { label: 'Center', value: 'center' },
    ],
    description: '',
  },
  {
    component: 'RadioButton',
    icon: <LineHeightOutlined />,
    width: 46,
    label: 'fontVariant',
    key: 'fontVariant',
    defaultValue: 'normal',
    size: 'large',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Small-caps', value: 'small-caps' },
    ],
    description: '',
  },
  {
    component: 'RadioButton',
    icon: <ItalicOutlined />,
    width: 46,
    label: 'fontStyle',
    key: 'fontStyle',
    defaultValue: 'normal',
    size: 'large',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Italic', value: 'italic' },
    ],
    description: '',
  },
  {
    component: 'RadioButton',
    icon: <BoldOutlined />,
    width: 46,
    label: 'fontWeight',
    key: 'fontWeight',
    defaultValue: 400,
    size: 'large',
    options: [
      { label: 'Normal', value: 400 },
      { label: 'Heavy', value: 900 },
    ],
    description: '',
  },
];

export function AText({ document, onChange, onDelete }: any) {
  const { id, activityId, content, cfg } = document;
  const [value, setValue] = useState<string>(content || 'Texte..');
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: cfg?.style?.width || 200,
    height: cfg?.style?.height || 30,
  });
  const [position, setPosition] = useState<any>(cfg?.position || [0, 0, 1]);
  const [scale, setScale] = useState<any>(cfg?.scale || [1, 1, 1]);
  const [rotation, setRotation] = useState<any>(cfg?.rotation || [0, 0, 0]);

  const { viewport } = useThree();
  const { factor } = viewport;

  const initialValues = useCallback(() => {
    const values = {};
    options?.forEach((item) => {
      values[item.key] = item.defaultValue;
    });
    return values;
  }, [options]);

  console.log('AText: cfg', cfg.position);

  const {
    controls: { /*changedField,*/ allFields },
    toggle,
  } = useControls({
    options,
    fieldsValue: cfg?.style || {},
    initialValues: Object.assign(initialValues(), cfg?.style || []),
  });

  const [spring, api] = useSpring<any>(() => ({
    rot: rotation || [0, 0, 0],
    scale: scale || [1, 1, 1],
    position: position || [3, 0, 1],
  }));

  useEffect(() => {
    onChange({
      id,
      activityId,
      content: value,
      cfg: {
        style: {
          ...allFields,
          width: size.width,
          height: size.height,
        },
        position,
        scale,
        rotation,
      },
    });
  }, [value, position, scale, rotation, allFields, size]);

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
      <Html css={{ width: size.width, height: size.height }}>
        <Resizable
          size={{ width: size.width, height: size.height }}
          onResizeStop={(e, direction, ref, d) => {
            setSize((prev) => ({
              width: prev.width + d.width,
              height: prev.height + d.height,
            }));
          }}
          css={{
            // overflow: 'auto',
            zIndex: 1000000000001,
            border: '2px dashed hotpink',
            '& div.ant-typography-edit-content': {
              margin: 0,
              left: 0,
            },
            '& div.ant-typography-edit-content textarea': {
              ...allFields,
              minWidth: size.width,
              minHeight: size.height,
              padding: 6,
              border: 'none',
              overflow: 'hidden',
            },
            '&:active, &:hover': {
              border: '2px dashed hotpink',
            },
          }}>
          <animated.div
            {...gesture()}
            css={{
              width: '100%',
              height: '100%',
              touchAction: 'none',
              display: 'flex',
            }}>
            <Typography.Paragraph
              css={{
                ...allFields,
                userSelect: 'none',
                width: '100%',
                height: '100%',
              }}
              editable={{
                // editing: true,
                onStart: () => {
                  toggle(true, allFields);
                },
                onEnd: () => {
                  toggle(false, allFields);
                },
                triggerType: ['icon'],
                onChange: (text: string) => {
                  setValue(text);
                },
              }}>
              {value}
            </Typography.Paragraph>
            {onDelete && (
              <Button
                onClick={onDelete}
                type='link'
                icon={<DeleteOutlined />}
              />
            )}
          </animated.div>
        </Resizable>
      </Html>
    </a3f.mesh>
  );
}
