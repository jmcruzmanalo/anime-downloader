import React from 'react';
import styled from 'styled-components';
import { List, Icon, Progress } from 'antd';
import { DownloadProgressDto } from '../../dto/torrent/download-progress.dto';
import { GetDownloadProgress_downloadProgress } from '../../generated/GetDownloadProgress';

const { Item } = List;

const IconText = ({ type, text }: any) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export const ListItem: React.FC<{
  downloadProgress: GetDownloadProgress_downloadProgress;
}> = ({ downloadProgress }) => {
  const { fileName, downloadSpeed, progress } = downloadProgress;

  const progressWheel = (
    <Progress type="circle" percent={progress} width={50} />
  );
  return (
    <Item
      key={fileName}
      actions={[
        <IconText type="download" text="Download" key="download-key" />
      ]}
      extra={progressWheel}
    >
      <Item.Meta title={fileName} description="hello" />
    </Item>
  );
};
