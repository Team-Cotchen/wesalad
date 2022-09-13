import React from 'react';

/**
 * @todo render check
 */

const ProfileImg = ({ url }: { url: string | undefined }) => {
  return (
    <div>
      <img src={url}></img>
    </div>
  );
};

export const MemoizedImgUrl = React.memo(ProfileImg);
