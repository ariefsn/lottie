'use client'

import { useOActions, useOState } from '@/store';
import { Button, Flex, Image } from '@mantine/core';

export default function Header() {
  const actions = useOActions();
  const state = useOState();

  return <Flex justify={'space-between'} w={'100%'}>
    <Flex align={'center'}>
      <div style={{ marginRight: '0.5rem' }}>
        <Image src="/logo.png" width={32} height={32} alt='Lottie Logo' />
      </div>
      {process.env.NEXT_PUBLIC_APP_NAME}
    </Flex>

    <Button key={state.app.isOffline.toString()} disabled={state.app.isOffline} onClick={() => actions.app.toggleFormUpload(true)}>
      Upload
    </Button>
  </Flex>;
}