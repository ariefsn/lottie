'use client';

import { store } from '@/store';
import { Provider } from 'overmind-react';

interface Props {
  children: React.ReactNode;
}

const StoreProvider = ({ children }: Props) => {
  return <Provider value={store}>{children}</Provider>;
};

export default StoreProvider;
