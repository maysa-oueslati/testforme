import React from 'react';
import { Link } from 'react-router-dom';
import { useRxCollection } from 'rxdb-hooks';
import { Button, Dropdown, Menu } from 'antd';
import {
  LikeOutlined,
  EyeOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

import useStore from '../../app/store';
import ButtonTip from '../../app/components/ButtonTip';

function DropdownContent({ activityId }: { activityId: string }) {
  // const removeActivity = useStore(
  //   (state) => state.activitySlice.removeActivity,
  // );
  
  const collection = useRxCollection('activities');
  
  const removeActivity = async (activityId) => {
    console.log("delete clicked", collection, activityId)
    const query = collection?.findOne().where('id').equals(activityId);
    await query?.remove();
  };

  return (
    <Menu>
      <Menu.Item key='delete'>
        <Link to='/dashboard'>
          <Button
            type='text'
            icon={
              <DeleteOutlined
                onClick={(e) => {
                  e.preventDefault();
                  removeActivity(activityId);
                }}
              />
            }
          />
        </Link>
      </Menu.Item>
    </Menu>
  );
}

const DropdownMenu = ({ activityId }: { activityId: string }) => (
  <Dropdown
    arrow
    key='more'
    overlay={<DropdownContent activityId={activityId} />}
    placement='bottomRight'>
    <Button
      type='text'
      icon={
        <EllipsisOutlined
          onClick={(e) => {
            e.preventDefault();
          }}
        />
      }
    />
  </Dropdown>
);

const Actions = ({ activityId, likeActivity }) => {
  return [
    <Link
      to={`/view-activity/${activityId}`}
      key='read'>
      <ButtonTip
        tip='View Activity'
        type='text'
        icon={<EyeOutlined />}
      />
    </Link>,
    <ButtonTip
      tip='Share Activity'
      key='eye'
      type='text'
      onClick={(e) => {
        e.preventDefault();
      }}
      icon={<ShareAltOutlined />}
    />,
    <ButtonTip
      tip='Like Activity'
      key='like'
      type='text'
      onClick={(e) => {
        e.preventDefault();
        likeActivity(activityId)
      }}
      icon={<LikeOutlined />}
    />,
    <DropdownMenu
      key='ellipsis'
      activityId={activityId}
    />,
  ];
};

export default Actions;
