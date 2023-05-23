import Image from 'next/image';
import React, { forwardRef } from 'react';
import { CSS } from 'stitches.config';
import { Box } from '@styles';
import { avatarFallback } from '@assets';

interface ProfileIconProps extends React.ComponentProps<typeof Image> {
  src: string;
  css?: CSS;
}

export const ProfileIcon = forwardRef<HTMLImageElement, ProfileIconProps>(
  ({ src, css, ...props }: ProfileIconProps, forwardedRef) => {
    return (
      <Box
        css={{
          size: '$7',
          br: '$round',
          fs: 0,
          position: 'relative',
          overflow: 'hidden',
          ...css,
        }}
      >
        <Image
          ref={forwardedRef}
          src={src || avatarFallback.src}
          {...props}
          fill
          alt=""
        />
      </Box>
    );
  }
);

ProfileIcon.displayName = 'ProfileIcon';
