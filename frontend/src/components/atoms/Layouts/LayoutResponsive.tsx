'use client';

import { useOActions, useOState } from '@/store';
import { AppShell, Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const LayoutResponsive = ({
	children,
	navbar,
	header
}: {
	children: React.ReactNode;
	navbar?: React.ReactNode;
	header?: React.ReactNode;
}) => {
	const [opened, { toggle }] = useDisclosure();
	const actions = useOActions();
	const state = useOState();

	return (
		<AppShell
			header={{ height: { base: 60, md: 70, lg: 80 } }}
			navbar={
				navbar
					? {
						width: { base: 200, md: 200, lg: 300 },
						breakpoint: 'sm',
						collapsed: { mobile: !opened }
					}
					: undefined
			}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md" flex={1} justify='space-between'>
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Group gap={0} visibleFrom='sm' w={'100%'}>
						{header}
					</Group>
					<Button disabled={state.app.isOffline} onClick={() => actions.app.toggleFormRegister(true)} hiddenFrom="sm" size="sm">
						Upload
					</Button>
				</Group>
			</AppShell.Header>

			{navbar && <AppShell.Navbar p="md">{navbar}</AppShell.Navbar>}

			<AppShell.Main style={{ wordBreak: 'break-all' }}>{children}</AppShell.Main>
		</AppShell>
	);
};

export default LayoutResponsive;
