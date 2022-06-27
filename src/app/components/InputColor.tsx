import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import { TwitterPicker } from 'react-color';
import chroma from 'chroma-js';

const InputColor = ({ value, size, onChange, style, icon }: any) => {
  const [currentColor, setCurrentColor] = useState(value);

  const handleChange = (color) => {
    setCurrentColor(
      'rgba(' +
        color.rgb.r +
        ', ' +
        color.rgb.g +
        ', ' +
        color.rgb.b +
        ', ' +
        color.rgb.a +
        ')',
    );

    onChange(
      'rgba(' +
        color.rgb.r +
        ', ' +
        color.rgb.g +
        ', ' +
        color.rgb.b +
        ', ' +
        color.rgb.a +
        ')',
    );
  };

  const colorPicker = (
    <TwitterPicker
      color={currentColor}
      triangle='hide'
      colors={[
        '#FF6900',
        '#FCB900',
        '#7BDCB5',
        '#00D084',
        '#8ED1FC',
        '#0693E3',
        '#ABB8C3',
        '#EB144C',
        '#F78DA7',
        '#9900EF',
        ...chroma.brewer.set3,
        '#EFF4FF',
        '#5F95FF',
        '#000',
        '#FFF',
      ]}
      onChangeComplete={handleChange}
    />
  );

  return (
    <Popover content={colorPicker}>
      <Button
        size={size}
        style={style}
        icon={icon}
      />
    </Popover>
  );
};

export default InputColor;
