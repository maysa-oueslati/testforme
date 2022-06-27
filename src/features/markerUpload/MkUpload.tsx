import React, { useCallback, useEffect } from 'react';
import { Upload, Typography, List } from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import { nanoid } from 'nanoid';

import useLogger from '../../app/logger';
import useStore from '../../app/store';

import ButtonTip from '../../app/components/ButtonTip';
import { ImagePreview } from '../../app/components/ImagePreview';

const createWorker = createWorkerFactory(() => import('./compiler'));

export default function MkUpload({ multiple = false }: any) {
  const log = useLogger('MkUpload');

  const worker = useWorker(createWorker);

  const markerImages = useStore((state) => state.mkUploadSlice.markerImages);
  const compiling = useStore((state) => state.mkUploadSlice.compiling);
  const setCompiling = useStore((state) => state.mkUploadSlice.setCompiling);

  const setMarkerImages = useStore(
    (state) => state.mkUploadSlice.setMarkerImages,
  );
  const setMarkerFile = useStore((state) => state.mkUploadSlice.setMarkerFile);

  useEffect(() => {
    if (compiling) compileFiles();
  }, [compiling]);

  const handleBeforeUpload = (file: any) => {
    setMarkerFile(null);
    setMarkerImages([...markerImages, file]);
    return false;
  };

  const handleRemove = (file: any) => {
    setMarkerFile(null);
    const index = markerImages.indexOf(file);
    const newFileList = markerImages.slice();
    newFileList.splice(index, 1);
    setMarkerImages(newFileList);
  };

  const compileFiles = useCallback(() => {
    setTimeout(() => {
      (async () => {
        const { blob } = await worker.compile(markerImages);

        const db = window['db'];

        // insert a document
        let hero = await db.activities
          .findOne({
            selector: {
              title: 'activity-1',
            },
          })
          .exec();

        if (!hero) {
          hero = await db.activities.insert({
            id: '123',
            title: 'activity-1',
            type: 'activity-type-1',
          });
        }

        const id = `marker-${nanoid(7)}.mind`;

        log.debug('marker id', id, blob);

        await hero.putAttachment(
          {
            id, // (string) name of the attachment like 'cat.jpg'
            data: blob, // (string|Blob|Buffer) data of the attachment
            type: 'text/plain', // (string) type of the attachment-data like 'image/jpeg'
          },
          true, // (boolean, optional, default=true) skipIfSame:If true and attachment already exists with same data, the write will be skipped
        );

        setCompiling(false);
        setMarkerFile(id);
      })();
    }, 2000);
  }, [markerImages]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Upload.Dragger
        name='file'
        showUploadList={false}
        style={{ border: '2px dashed hotpink' }}
        multiple={multiple}
        onRemove={handleRemove}
        beforeUpload={handleBeforeUpload}
        fileList={markerImages}>
        <Typography.Paragraph>
          <InboxOutlined style={{ fontSize: '3.5rem', height: '100%' }} />
        </Typography.Paragraph>

        <Typography.Paragraph
          style={{
            fontSize: '1.2rem',
            width: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
          }}>
          Faites glisser et déposez une image depuis votre machine ou cliquez
          ici pour sélectionner une image à télécharger.
        </Typography.Paragraph>
      </Upload.Dragger>

      <List>
        {markerImages?.map((file) => (
          <List.Item
            style={{ border: '1px solid #ccc', padding: 8, margin: '8px 0' }}
            key={file.uid}
            actions={[
              <ButtonTip
                tip='Delete'
                key='Delete'
                type='text'
                onClick={handleRemove}
                icon={<DeleteOutlined />}
              />,
            ]}>
            <ImagePreview
              key={file.uid}
              file={file}
              width={56}
              height={56}
            />
          </List.Item>
        ))}
      </List>
    </div>
  );
}
