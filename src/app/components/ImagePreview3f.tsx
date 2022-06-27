import React, { useState, useEffect } from 'react';
import { RcFile } from 'antd/es/upload';
import { useTexture } from '@react-three/drei';

function Texture(props: any) {
  const { url, scale, ...others } = props;

  const texture: any = useTexture(url);

  return url ? (
    <mesh scale={scale}>
      <planeBufferGeometry attach='geometry' />
      <meshStandardMaterial
        {...others}
        toneMapped={false}
        precision='highp'
        attach='material'
        map={texture}
      />
    </mesh>
  ) : null;
}

export function ImagePreview3f(props: any) {
  const { file, ...others } = props;

  const [previewImage, setPreviewImage] = useState<any>(null);

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const image: any = new Image();

        //Set the Base64 string return from FileReader as source.
        image.src = reader.result;

        image.onload = function () {
          setPreviewImage(reader.result);
          // setW(this.width);
          // setH(this.height);
          return resolve(reader.result as string);
        };
      };
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    const getPreviewUrl = async (file) => {
      return (await getBase64(file as RcFile)) as string;
    };

    getPreviewUrl(file);
  }, [file]);

  return previewImage ? (
    // <Image3f {...others} url={previewImage} />
    <Texture
      {...others}
      url={previewImage}
    />
  ) : null;
}
