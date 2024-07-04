'use client';

import { useOState } from '@/store';
import { Box, LoadingOverlay, MantineProvider, createTheme } from '@mantine/core';
import Notifications from '../Notifications/Notifications';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

interface Props {
  children: React.ReactNode;
}

const theme = createTheme({
  autoContrast: true,
  luminanceThreshold: 0.45
});

const UIProvider = ({ children }: Props) => {
  const { app } = useOState();

  return (
    <MantineProvider theme={theme}>
      <Box pos={'relative'}>
        {children}
        <ThemeSwitcher />
        <Notifications />
        <LoadingOverlay
          visible={app.isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Box>
    </MantineProvider>
  );
};

export default UIProvider;
