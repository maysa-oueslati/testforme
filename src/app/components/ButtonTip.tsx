import React from 'react';
import { Button, Tooltip } from 'antd';

export default function ButtonTip(props: any) {
  const { tip, children } = props;

  return (
    <Tooltip title={tip}>
      <Button {...props}>{children}</Button>
    </Tooltip>
  );
}
