import React from 'react';
import { Link } from 'react-router-dom';
import { useRxCollection, useRxData } from 'rxdb-hooks';
import { Space, Tabs, Typography, Button, Card } from 'antd';
import {
  PlusCircleOutlined,
  MonitorOutlined,
  ContainerOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import PageHeader from '../navigation/PageHeader';
import useStore from '../../app/store';
import GirdCenter from '../../app/components/GridCenter';
import ActivityActions from '../activity/Actions';
import Activity from '../activity/Activity';

import validate from '../../assets/validate.png';
import parcours from '../../assets/parcours.png';
import label from '../../assets/label.png';
import group from '../../assets/group.png';
import calc from '../../assets/calc.png';
import augment from '../../assets/augment.png';
import assemblage from '../../assets/assemblage.png';

import { activitySchema } from '../../app/db/schemas';
import { ActivityDocType } from '../../app/db/types';

const { TabPane } = Tabs;

export default function Dashboard() {
  return (
    <Space
      direction='vertical'
      style={{ width: '100%', height: '100%' }}>
      <PageHeader
        route='/dashboard'
        content={null}
      />
      <Tabs
        defaultActiveKey='1'
        centered>
        <TabPane
          tab={
            <Typography.Title level={4}>
              <ContainerOutlined />
              Mon Contenu
            </Typography.Title>
          }
          key='1'>
          <Content />
        </TabPane>
        <TabPane
          tab={
            <Typography.Title level={4}>
              <MonitorOutlined />
              Suivi d&apos;Apprenants
            </Typography.Title>
          }
          key='2'>
          <Typography.Title level={3}>
            {' '}
            Suivi d&apos;Apprenants
          </Typography.Title>
        </TabPane>
      </Tabs>
    </Space>
  );
}

function Content() {

  const { result: activities } = useRxData(
    'activities',
    collection => collection.find()
  );

  const collection = useRxCollection('activities');

  const showMenu = useStore((state) => state.activitySlice.showMenu);
  const addActivity = useStore((state) => state.activitySlice.addActivity);
  const updateAura = useStore((state) => state.activitySlice.updateAura);

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
    <GirdCenter>
      <Card style={{ width: 200, height: 300, border: '2px dashed #1890ff' }}>
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
  );
}
