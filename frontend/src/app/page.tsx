'use client'

import { FormRegister, FormUpload } from "@/components/molecules";
import { FileItemLocal } from "@/entities";
import { useOActions, useOState } from "@/store";
import {
  Player
} from '@lottiefiles/react-lottie-player';
import { Button, Flex, Grid, Group, Modal, Pagination, Paper, Text } from "@mantine/core";
import { useState } from "react";

export default function Home() {
  const actions = useOActions();
  const state = useOState();

  const onPaginationChange = async (page: number) => {
    actions.file.setSearchParams({
      ...state.file.searchPayload,
      skip: (page - 1) * state.file.limit
    })
    actions.app.toggleLoading(true)
    await actions.file.gets()
    actions.app.toggleLoading(false)
  };

  const [showDetails, setShowDetails] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FileItemLocal | null>(null)
  const onSelectItem = async (item: FileItemLocal) => {
    setSelectedItem(item)
    setShowDetails(true)
  }

  return (
    <div>
      {
        selectedItem && <Modal
          opened={showDetails}
          centered
          onClose={() => setShowDetails(false)}
        >
          <Player src={JSON.parse(JSON.stringify(selectedItem!.data))} autoplay loop />
          <Group gap={'0'}>
            {
              [{
                title: 'Title',
                value: selectedItem.info.name
              }, {
                title: 'Creator',
                value: [selectedItem.info.createdBy?.firstName, selectedItem.info.createdBy?.lastName].join(' ')
              }, {
                title: 'Size',
                value: selectedItem.info.fileSize.formated
              }, {
                title: 'Tags',
                value: selectedItem.info.tags.join(', ')
              }, {
                title: 'Framerate',
                value: selectedItem.info.framerate
              }, {
                title: 'Likes',
                value: selectedItem.info.likes?.length ?? 0
              }, {
                title: 'Downloads',
                value: selectedItem.info.downloads
              }, {
                title: 'Version',
                value: selectedItem.info.version
              }].map((item, index) => (
                <Flex justify={'space-between'} align={'center'} w={'100%'} key={'details_' + index}>
                  <Text size="sm">{item.title}</Text>
                  <Text size="sm" fw={600}>{item.value}</Text>
                </Flex>
              ))
            }
          </Group>

          <Button mt={'md'} disabled={state.app.isOffline} fullWidth onClick={() => {
            window.open('/files/' + selectedItem!._id + '.json?download=true', '_blank')
          }}>
            Download
          </Button>
        </Modal>
      }

      <Modal
        opened={state.app.isFormRegisterOpened}
        centered
        onClose={() => {
          actions.app.toggleFormRegister(false)
          actions.app.toggleFormUpload(true)
        }}
      >
        <FormRegister />
      </Modal>

      <Modal
        opened={state.app.isFormUploadOpened}
        centered
        onClose={() => actions.app.toggleFormUpload(false)}
      >
        <FormUpload />
      </Modal>
      <Grid gutter={12} justify="center">
        {
          state.file.items.length === 0 ? <Text fw={600}>No data yet.</Text> :
            state.file.items.map((item) => {
              return <Grid.Col key={item._id} span={{ xs: 6, sm: 4, md: 3, lg: 3, xl: 2 }} className="cursor-pointer">
                <Paper shadow="md" p="md" onClick={() => onSelectItem(item)}>
                  <Player src={JSON.parse(JSON.stringify(item.data))} autoplay loop />
                  <Text fw={600}>{item.info.name}</Text>
                  <Text size="sm" fw={500}>{[item.info.createdBy?.firstName, item.info.createdBy?.lastName].join(' ')}</Text>
                  <Text size="sm">{item.info.fileSize.formated}</Text>
                  <Text size="sm">{item.info.likes?.length ?? 0}</Text>
                  <Text size="sm">{item.info.version ? ('v' + item.info.version) : '-'}</Text>
                </Paper>
              </Grid.Col>
            })
        }
      </Grid>

      <Flex justify={'center'} w={'100%'}>
        <Pagination mt={'md'} total={state.file.pageTotal} value={state.file.page} onChange={onPaginationChange} />
      </Flex>
    </div>
  );
}
