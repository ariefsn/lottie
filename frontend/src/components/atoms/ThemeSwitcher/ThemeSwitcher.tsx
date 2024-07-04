'use client';

import { TAppTheme } from '@/entities';
import { useOActions, useOState } from '@/store';
import { UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';

const ThemeSwitcher = () => {
	const { toggleColorScheme, colorScheme } = useMantineColorScheme();
	const state = useOState();
	const actions = useOActions();

	const onSwitch = () => {
		toggleColorScheme();
	};

	useEffect(() => {
		actions.app.setTheme(colorScheme.toString() as TAppTheme);
	}, [colorScheme, actions.app]);

	return (
		<UnstyledButton
			onClick={onSwitch}
			component="button"
			color="red"
			style={{ position: 'fixed', right: 20, bottom: 10 }}
		>
			{state.app.isDarkMode ? <MdOutlineLightMode size={24} /> : <MdDarkMode size={24} />}
		</UnstyledButton>
	);
};

export default ThemeSwitcher;
