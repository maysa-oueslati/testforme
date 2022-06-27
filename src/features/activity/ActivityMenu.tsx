import React from 'react';
import { Link } from 'react-router-dom';
import { useRxCollection } from 'rxdb-hooks';
import { Modal, Card, Typography, Tooltip } from 'antd';
import { nanoid } from 'nanoid';

import useStore from '../../app/store';
import GirdCenter from '../../app/components/GridCenter';
import useLogger from '../../app/logger';

import validate from '../../assets/validate.png';
import parcours from '../../assets/parcours.png';
import label from '../../assets/label.png';
import group from '../../assets/group.png';
import calc from '../../assets/calc.png';
import augment from '../../assets/augment.png';
import assemblage from '../../assets/assemblage.png';
import { ActivityDocType } from '../../app/db/types';

export default function ActivityMenu() {
  const log = useLogger('Activity');
  const collection = useRxCollection('activities');

  const visible = useStore((state) => state.activitySlice.visible);
  const hide = useStore((state) => state.activitySlice.hideMenu);
  const setActivity = useStore((state) => state.editorSlice.setActivity);
  const addActivity = useStore((state) => state.activitySlice.addActivity);

  const activities = [
    {
      title: 'Augmenter une image',
      description:
        'Ajouter des ressources media (text, vidéo, lien, son…) sur une image',
      cover: augment,
    },
    {
      title: 'Annoter une image',
      description:
        'Ajouter des labels avec des ressources media (text, vidéo, lien, son…) à une image',
      cover: label,
    },
    {
      title: 'Valider une image',
      description:
        'Ajouter un feedback de type animation ou son si bonne image ou pas',
      cover: validate,
    },
    {
      title: 'Associer deux images',
      description:
        'Ajouter un feedback de type animation ou son si on a deux marqueurs simultanément ou pas',
      cover: assemblage,
    },
    {
      title: 'Superposer des calques',
      description:
        'Superposer plusieurs images simultanées —de la même taille que le marqueur',
      cover: calc,
    },
    {
      title: 'Parcours d’activités',
      description: 'Combiner des activités avec un ordre défini',
      cover: parcours,
    },
    {
      title: 'Groupe d’activités',
      description: 'Grouper des activités',
      cover: group,
    },
  ];

  const onClickCard = async (data: Partial<ActivityDocType>) => {
    const { title, description, cover } = data;

    await collection?.insert({
      id: nanoid(),
      title,
      description,
      cover,
      likes: 0,
    });
  };

  const cards = activities.map((activity: any) => (
    <Link
      to='/edit-activity'
      onClick={() => {
        setActivity('Activity: ' + activity.title);
        hide();
        onClickCard({
          title: activity.title,
          description: activity.description,
          cover: 'augment',
        });
      }}
      key={activity.title}>
      <Card
        style={{ width: 220, height: 300 }}
        cover={
          <img
            style={{
              width: 200,
              height: 150,
              display: 'flex',
              alignItems: 'center',
              margin: 'auto',
            }}
            alt='example'
            src={activity.cover}
          />
        }>
        <Card.Meta
          title={
            <Typography.Title level={5}>{activity.title}</Typography.Title>
          }
          description={
            <Tooltip title={activity.description}>
              <Typography.Text style={{ fontSize: 13 }}>
                {activity.description}
              </Typography.Text>
            </Tooltip>
          }
        />
      </Card>
    </Link>
  ));

  return (
    <Modal
      centered
      width={'80%'}
      title='Ajoutez votre propre activité'
      visible={visible}
      footer={null}
      onCancel={hide}>
      <GirdCenter width={220}>{cards}</GirdCenter>
    </Modal>
  );
}
