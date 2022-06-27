import React from 'react';

import { Form, Input, Slider, Switch, InputNumber, Select } from 'antd';

import useLogger from '../../app/logger';

import InputColor from '../../app/components/InputColor';
import RadioButton from '../../app/components/RadioButton';

function FormItem({ item }: any) {
  const log = useLogger('FormItem');

  const {
    component,
    isSwitch,
    defaultValue: value,
    label,
    key,
    // description,
    width,
    ...otherProps
  } = item;

  const style = {
    width: width || 46,
  };

  const handleColorChange = () => {
    log.debug('');
  };

  let fieldComponent;

  switch (component) {
    case 'RadioButton':
      fieldComponent = (
        <RadioButton
          {...item}
          onChange={handleColorChange}
        />
      );
      break;
    case 'Slider':
      fieldComponent = (
        <Slider
          placeholder={label}
          {...otherProps}
          style={style}
        />
      );
      break;
    case 'Switch':
      fieldComponent = (
        <Switch
          defaultChecked={value}
          {...otherProps}
        />
      );
      break;
    case 'Input':
      fieldComponent = (
        <Input
          {...otherProps}
          css={style}
        />
      );
      break;
    case 'Select':
      fieldComponent = (
        <Select
          placeholder={label}
          {...otherProps}
          style={style}
        />
      );
      break;
    case 'InputNumber':
      fieldComponent = (
        <InputNumber
          {...otherProps}
          style={style}
        />
      );
      break;
    case 'InputColor':
      fieldComponent = (
        <InputColor
          value={value}
          style={style}
          {...otherProps}
          onChange={handleColorChange}
        />
      );
      break;

    default:
      break;
  }

  return (
    <Form.Item
      key={key}
      name={key}
      valuePropName={isSwitch ? 'checked' : undefined}>
      {fieldComponent}
    </Form.Item>
  );
}

export default function ControlsForm({
  options,
  form,
  initialValues,
  onChange,
}: any) {
  return (
    <Form
      form={form}
      name='basic'
      layout='inline'
      autoComplete='off'
      initialValues={initialValues}
      onValuesChange={(changedField, allFields) => {
        onChange(changedField, allFields);
      }}>
      <Input.Group
        compact
        style={{ padding: '0 16px' }}>
        {options.map((item: any) => (
          <FormItem
            key={item.key}
            item={item}
          />
        ))}
      </Input.Group>
    </Form>
  );
}
