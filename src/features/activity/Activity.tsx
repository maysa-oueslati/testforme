import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRxCollection, useRxData } from 'rxdb-hooks';
import { Space, Tabs, Typography, Button, Card, Descriptions } from 'antd';
import {
  PlusCircleOutlined,
  MonitorOutlined,
  ContainerOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import PageHeader from '../navigation/PageHeader';
import GirdCenter from '../../app/components/GridCenter';
import useStore from '../../app/store';
import useLogger from '../../app/logger';

import validate from '../../assets/validate.png';
import parcours from '../../assets/parcours.png';
import label from '../../assets/label.png';
import group from '../../assets/group.png';
import calc from '../../assets/calc.png';
import augment from '../../assets/augment.png';
import assemblage from '../../assets/assemblage.png';
import { activitySchema } from '../../app/db/schemas';
import { ActivityDocType } from '../../app/db/types';
import { border } from '@mui/system';

function Activity() {
  const log = useLogger('Activity');
  const params = useParams();

  const collection = useRxCollection('activities');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [likes, setLikes] = useState(0);

  const { Text } = Typography;

  useEffect(() => {
    const fetchActivity = async () => {
      const activity = await collection?.findOne().where('id').equals(params.id).exec();
      if (activity) {
        setTitle(activity.get('title'));
        setDescription(activity.get('description'));
        setLikes(activity.get('likes'));
      }
    }

    fetchActivity();

  }, [collection])

  const getActivity = useStore(
    (state) => state.activitySlice.getActivity,
  );
  const retrieveAuras = useStore(
    (state) => state.activitySlice.retriveAuras,
  );
  const updateActivity = useStore(
    (state) => state.activitySlice.updateActivity,
  );
  
  const handleUpdate = () => {
    updateActivity(params);

  };

  const onChangeDescription = async (e) => {
    setDescription(e.target.value);
    const query = collection?.findOne().where('id').equals(params.id);
    await query?.update({
      $set: {
        description: e.target.value
      }
    });
  }

  const onChangeTitle = async (e) => {
    setTitle(e.target.value);
    const query = collection?.findOne().where('id').equals(params.id);
    await query?.update({
      $set: {
        title: e.target.value
      }
    });
  }

  return (
    <Space
      direction='vertical'
      style={{ width: '100%', height: '100%' }}>
      <PageHeader
        route='/view-activity'
        content={null}
      />
      <Card
        style={{ width: 500, height: 500, border: '1px solid #eee', left: 400 }}
        bodyStyle={{ padding: 6 }}
        cover={
          <img
            style={{ width: 500, height: 200 }}
            alt='example'
            src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
          />
        }>
        <Card.Meta
          title={
            <input
              type='text'
              placeholder='votre activité'
              style={{
                backgroundColor: 'white',
                color: 'black ',
                border: 'none',
              }}
              value={title}
              onChange={onChangeTitle}
            />
          }
          description={
            <textarea
              rows={4}
              placeholder='votre activité'
              style={{
                backgroundColor: 'white',
                color: 'black ',
                border: 'none',
                width: '100%',
              }}
              value={description}
              onChange={onChangeDescription}
            />
          }
        />

        <Space>
          <Text type="success">Likes: {likes}</Text>
        </Space>
        
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
    </Space>
  );
}
function ActivityActions(arg0: {
  activityId: any;
}): React.ReactNode[] | undefined {
  throw new Error('Function not implemented.');
}

export default Activity;