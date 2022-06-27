import React from 'react';

export function Center3f(props: any) {
  const { children, viewport, top = 0, left = 0 } = props;

  return (
    <group
      position={[viewport.width / 2 + left, -viewport.height / 2 + top, 0]}>
      {children}
    </group>
  );
}
