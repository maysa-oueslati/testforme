import React from 'react';
import { Radio } from 'antd';

/** @jsxImportSource @emotion/react */

export default function RadioButton(props: any) {
  const { icon, value, defaultValue, size, options, onChange, width } = props;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const style =
    value !== defaultValue
      ? { width, fontWeight: 'bold', color: '#000' }
      : { color: '#ccc', width };

  return (
    <Radio.Group
      value={value}
      size={size}
      onChange={handleChange}>
      {options.map((option: any) => (
        <>
          {value !== option.value ? (
            <Radio.Button
              css={style}
              key={option.label}
              value={option.value}>
              {icon}
            </Radio.Button>
          ) : null}
        </>
      ))}
    </Radio.Group>
  );
}
