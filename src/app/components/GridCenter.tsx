import React from 'react';

export default function GirdCenter(props: any) {
  const { children, width = 200 } = props;

  return (
    <div
      style={{
        padding: '0 18px',
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, ${width}px)`,
        justifyContent: 'center',
        gridGap: 8,
      }}>
      {children}
    </div>
  );
}
