'use client'

import { IMap } from "@/entities"
import { useOActions, useOState } from "@/store"
import { Button, ColorInput, Group, Select, TagsInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect } from "react"

export default function NavBarFilter() {
  const state = useOState()
  const { file, app } = useOActions()

  const form = useForm({
    initialValues: {
      name: '',
      tags: [] as string[],
      version: '',
      framerate: '',
      // colors: [] as string[],
      color: ''
    },
  })

  const onSubmit = async (values: typeof form.values) => {
    const m: IMap = {
      name: values.name,
      tags: values.tags.join(','),
      version: values.version,
      framerate: values.framerate,
      color: values.color
    }

    for (const k in m) {
      if (!m[k]) delete m[k]
    }

    const params = new URLSearchParams(m)
    window.history.pushState(null, '', `?${params.toString()}`)

    await onRefetchFiles(values)
  }

  const onRefetchFiles = async (values: typeof form.values) => {
    app.toggleLoading(true);
    try {
      form.setValues(JSON.parse(JSON.stringify(values)))
      await file.setSearchParams({
        name: values.name,
        framerate: Number(values.framerate),
        tags: values.tags,
        version: values.version,
        colors: values.color ? [values.color] : [],
        skip: 0,
        limit: 10,
      })

      await file.gets()
    } catch (error) {
    } finally {
      app.toggleLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const values = {
      name: params.get('name') || '',
      tags: params.get('tags')?.split(',') || [],
      version: params.get('version') || '',
      framerate: params.get('framerate') || '',
      color: params.get('color') || ''
    }

    onRefetchFiles(values)
  }, [])

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Title"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />

      <TagsInput
        pt={'xs'}
        label="Tags"
        key={form.key('tags')}
        data={state.file.options.tags}
        {...form.getInputProps('tags')}
      />

      <Select
        pt={'xs'}
        label="Frame Rate"
        clearable
        key={form.key('framerate')}
        data={state.file.options.framerates}
        {...form.getInputProps('framerate')}
      />

      <Select
        pt={'xs'}
        label="Version"
        data={state.file.options.versions}
        clearable
        key={form.key('version')}
        {...form.getInputProps('version')}
      />

      <ColorInput
        pt={'xs'}
        label="Color"
        key={form.key('color')}
        {...form.getInputProps('color')}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Filter</Button>
      </Group>

    </form>
  )
}