'use client';

import { TAppNotificationType } from '@/entities';
import { isEmpty } from '@/helper';
import { useOActions, useOState } from '@/store';
import { Box, Notification, useMantineTheme } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const Notifications = () => {
	const theme = useMantineTheme();
	const state = useOState();
	const actions = useOActions();

	const NOTIFICATION_TYPE_MAP: Record<TAppNotificationType, string> = {
		error: theme.colors.red[7],
		info: theme.colors.blue[7],
		success: theme.colors.green[7],
		warning: theme.colors.yellow[7]
	};

	const [seconds, setSeconds] = useState(0);
	const interval = useInterval(() => setSeconds((s) => s + 1), 1000);
	const [deleteId, setDeleteId] = useState('');
	const delay = 5;

	useEffect(() => {
		interval.start();
		return interval.stop;
	}, []);

	useEffect(() => {
		if (state.app.notifications.length > 0 && !interval.active) {
			interval.toggle();
		} else if (state.app.notifications.length === 0 && interval.active) {
			interval.toggle();
			setSeconds(0);
		} else if (state.app.notifications.length > 0 && interval.active) {
			if (seconds > 0 && seconds % delay === 0 && !deleteId) {
				const first = state.app.notifications[0];
				const firstId = first.id!;
				setDeleteId(firstId);
			}
		}
	}, [seconds, state.app.notifications.length, actions.app.clearNotif, deleteId, state.app.notifications]);

	useEffect(() => {
		if (deleteId) {
			actions.app.closeNotif(deleteId);
			setTimeout(() => {
				setDeleteId('');
			}, 500);
		}
	}, [deleteId, actions.app]);

	return (
		<Box pos={'fixed'} right={10} bottom={10}>
			{state.app.notifications.map((n, i) => (
				<Notification
					key={n.id}
					color={NOTIFICATION_TYPE_MAP[n.type ?? 'info'] as string}
					title={n.title}
					withCloseButton={!isEmpty(n.id)}
					withBorder={false}
					mb={i === state.app.notifications.length - 1 ? 0 : 10}
					onClose={() => {
						actions.app.closeNotif(n.id!);
						n.onClose?.call(this);
					}}
				>
					{n.message}
				</Notification>
			))}
		</Box>
	);
};

export default Notifications;
