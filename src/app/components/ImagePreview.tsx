import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import { RcFile } from 'antd/es/upload';

export function ImagePreview({
  file,
  width,
  height,
}: {
  file: any;
  width: number;
  height: number;
}) {
  const [previewImage, setPreviewImage] = useState<any>('');

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImage(reader.result);
        return resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    const getPreviewUrl = async (file) => {
      return (await getBase64(file as RcFile)) as string;
    };

    getPreviewUrl(file);
  }, [file]);

  return (
    <Zoom wrapStyle={{ zIndex: 0 }}>
      <img
        style={{ zIndex: 0 }}
        alt='that wanaka tree'
        src={previewImage}
        width={width}
        height={height}
      />
    </Zoom>
  );
}
