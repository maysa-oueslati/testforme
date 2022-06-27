import React from 'react';
import { Link } from 'react-router-dom';
import { useRxCollection, useRxData } from 'rxdb-hooks';
import { Space, Typography, Button, Card, Divider } from 'antd';
import { PlusCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

import PageHeader from '../navigation/PageHeader';
import useStore from '../../app/store';
import GirdCenter from '../../app/components/GridCenter';
import ActivityActions from '../activity/Actions';

const IconLink = ({ src, text }: { src: string; text: string }) => (
  <Link to=''>
    <img
      src={src}
      alt={text}
      style={{ marginRight: 4, width: 24 }}
    />
    <Typography.Link style={{ fontSize: 18 }}>{text}</Typography.Link>
  </Link>
);

const HeaderContent = (
  <Space
    direction='vertical'
    style={{ width: '100%' }}>
    <Typography.Text>
      MIXAP Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
      magni inventore vel facere voluptatibus.
    </Typography.Text>
    <Space align='baseline'>
      <IconLink
        src='https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg'
        text='Démarrer'
      />
      <IconLink
        src='https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg'
        text="Plus d'Information"
      />
      <IconLink
        src='https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg'
        text='Tutoriels'
      />
    </Space>
    <Divider />
  </Space>
);

export default function Home() {
  const { result: activities } = useRxData(
    'activities',
    collection => collection.find()
  );

  const collection = useRxCollection('activities');

  const showMenu = useStore((state) => state.activitySlice.showMenu);
  const addActivity = useStore((state) => state.activitySlice.addActivity);

  const likeActivity = async (id) => {
    const query = collection?.findOne().where('id').equals(id);
    await query?.update({
      $inc: {
        likes: 1,
      }
    });
  };

  const cards = activities.map((activity) => (
    <Link
      to={'/view-activity/'+ activity.get('id')}
      key={activity.get('id')}>
      <Card
        style={{ width: 200, height: 300, border: '1px solid #eee' }}
        bodyStyle={{ padding: 6 }}
        cover={
          <img
            style={{ width: 200, height: 100 }}
            alt='example'
            src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
          />
        }
        actions={ActivityActions({ activityId: activity.get('id'), likeActivity: likeActivity })}>
        <Card.Meta
          title={activity.get('title')}
          description={activity.get('description')}
        />
        <Space
          direction='vertical'
          align='center'
          style={{ marginTop: 12, width: '100%' }}>
          <PlayCircleOutlined style={{ fontSize: 22, color: '#777' }} />
          <Link to='/play-activity'>
            <Button shape='round'>Lancer l&apos;activité</Button>
          </Link>
        </Space>
      </Card>
    </Link>
  ));

  return (
    <Space
      direction='vertical'
      style={{ width: '100%', height: '100%' }}>
      <PageHeader
        route='/'
        content={HeaderContent}
      />
      <GirdCenter>
        <Card
          style={{
            width: 200,
            height: 300,
            border: '2px dashed #1890ff',
          }}>
          <Space
            direction='vertical'
            align='center'
            style={{ marginTop: '30%' }}>
            <PlusCircleOutlined style={{ fontSize: 22, color: '#777' }} />
            <Button
              type='primary'
              shape='round'
              onClick={showMenu}>
              Ajouter une activité
            </Button>
          </Space>
        </Card>
        {cards}
      </GirdCenter>
    </Space>
  );
}
