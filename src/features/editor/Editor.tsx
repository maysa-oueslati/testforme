import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Div100vh from 'react-div-100vh';
import useSound from 'use-sound';

import { Button, Layout, PageHeader, Space } from 'antd';

import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import MusicVideoOutlinedIcon from '@mui/icons-material/MusicVideoOutlined';
import SmartButtonOutlinedIcon from '@mui/icons-material/SmartButtonOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

/** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';

import useStore from '../../app/store';
import pop from '../../assets/sounds/pop.mp3';

import Board3f from './Board';
const { Header, Content, Sider } = Layout;

export default function Editor() {
  const navigate = useNavigate();
  const [playPop] = useSound(pop);

  const activity = useStore((state) => state.editorSlice.activity);
  const addAura = useStore((state) => state.activitySlice.addAura);

  const btnStyle = {
    width: 46,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconBtnStyle = {
    fontSize: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Div100vh>
      <Layout css={{ height: '100%', background: 'none', overflow: 'hidden' }}>
        <Header
          css={{
            background: 'transparent',
            padding: '0 16px',
            marginBottom: '1.5rem',
          }}>
          <PageHeader
            title={activity}
            onBack={() => navigate(-1)}
            extra={[
              <Button
                key='1'
                shape='round'>
                <Link
                  to='/dashboard'
                  type='secondary'>
                  Tableau de bord
                </Link>
              </Button>,
            ]}
          />
        </Header>

        <Layout
          style={{
            overflowY: 'hidden',
            width: '100%',
            height: '100%',
            background: 'none',
          }}>
          <Sider
            theme='light'
            collapsible={false}
            width={64}
            collapsedWidth={64}
            css={{
              display: 'flex',
              overflow: 'hidden',
              flexDirection: 'column',
              background: 'none',
              '& .ant-layout-sider-children': {
                marginBottom: 'auto',
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
                alignItems: 'center',
              },
            }}>
            <Space direction='vertical'>
              <Button
                css={btnStyle}
                onClick={() => {
                  playPop();
                  addAura({ type: 'AText', content: 'Texte Editable...' });
                }}>
                <TextSnippetOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <ViewInArOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button
                css={btnStyle}
                onClick={() => addAura({ type: 'AImage', content: '' })}>
                <InsertPhotoOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <SmartButtonOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <QuizOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <FilePresentOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <MusicVideoOutlinedIcon css={iconBtnStyle} />
              </Button>
              <Button css={btnStyle}>
                <AudiotrackOutlinedIcon css={iconBtnStyle} />
              </Button>
            </Space>
          </Sider>

          <Content
            style={{
              width: 'calc(100% -64px)',
              height: '100%',
              padding: '0 6px',
            }}>
            <Board3f />
          </Content>
        </Layout>
      </Layout>
    </Div100vh>
  );
}
