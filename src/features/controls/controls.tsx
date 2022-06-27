import React, { useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import ControlsForm from './ControlsForm';
import useLogger from '../../app/logger';

export default function useControls({ options, fieldsValue, initialValues }) {
  const log = useLogger('useControls');
  const [form] = Form.useForm();
  const [controls, setControls] = useState({
    changedField: {},
    allFields: Object.assign(initialValues, fieldsValue),
  });

  useEffect(() => {
    form.setFieldsValue(fieldsValue);
  }, [form, fieldsValue]);

  const modal = () => ({
    key: 'controls-form',
    message: null,
    duration: 0,
    description: (
      <ControlsForm
        form={form}
        options={options}
        fieldsValue={fieldsValue}
        initialValues={initialValues}
        onChange={handleChange}
      />
    ),
    style: {
      width: '100%',
    },
  });

  // useEffect(() => {
  //   modal.update({ visible });
  // }, [visible]);

  const handleChange = (changedField, allFields) => {
    log.debug('changedField, allFields', changedField, allFields);
    setControls({ changedField, allFields });
  };

  const toggle = (visibility: boolean, allFields: any) => {
    form.setFieldsValue(allFields);

    if (visibility) notification.open(modal());
    else notification.close('controls-form');
  };

  return { controls, toggle };
}
