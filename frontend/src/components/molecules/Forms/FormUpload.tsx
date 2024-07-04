'use client'

import { FileCreateInput } from "@/graphql.generated";
import { parseGqlError, sleep } from "@/helper";
import { useOActions, useOEffects, useOState } from "@/store";
import { Button, Checkbox, FileInput, Group, TagsInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { LiaCheckCircleSolid, LiaTimesCircleSolid } from "react-icons/lia";

export default function FormUpload() {
  const { app, file } = useOActions();
  const { gql } = useOEffects();
  const state = useOState();
  const [error, setError] = useState<string>('')
  const [creator, setCreator] = useDebouncedState('', 600)
  const [remember, setRemember] = useState(localStorage.getItem('email_remember') === 'true')

  const form = useForm<FileCreateInput>({
    initialValues: {
      name: '',
      tags: [] as string[],
      creator: localStorage.getItem('email_remember') === 'true' ? localStorage.getItem('email') : null,
      file: null,
    },
    validate: {
      creator: (value) => (value.length > 0 ? null : 'Email is required'),
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      file: (value) => (value ? null : 'Last name is required'),
    },
    onValuesChange: (values) => {
      setError('')
      setCreator(values.creator)
      if (remember) {
        localStorage.setItem('email', values.creator)
      }
    },
  })

  const [isEmailValid, setIsEmailValid] = useState(false)

  useEffect(() => {
    if (!remember) return
    const email = localStorage.getItem('email')
    if (!email) {
      localStorage.removeItem('email_remember')
      setRemember(false)
      return
    }
    form.setFieldValue('creator', email)
    setCreator(email)
  }, [remember, form, setCreator])

  useEffect(() => {
    if (!creator) return
    gql.queries.USER_GET({ input: creator }).then((res) => {
      setIsEmailValid(res.userGet !== null)
    }).catch((err) => {
      setIsEmailValid(false)
      setError(parseGqlError(err))
    })
  }, [creator, gql.queries])

  const onSubmit = async (values: typeof form.values) => {
    const res = form.validate()
    if (res.hasErrors) return

    if (!isEmailValid) {
      setError('Invalid email')
      return
    }

    try {
      app.toggleLoading();
      const resCreate = await gql.mutations.FILE_CREATE({ input: values })
      app.pushNotif({
        title: 'Success',
        message: 'File Uploaded',
      })
      form.reset()
      app.toggleFormUpload(false)
      await sleep(1000)
      await Promise.all([
        file.gets(),
        file.getOptions()
      ])
    } catch (error: any) {
      setError(parseGqlError(error))
    } finally {
      app.toggleLoading();
    }
  }

  return <>
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Email"
        key={form.key('creator')}
        {...form.getInputProps('creator')}
        rightSection={<>
          <>
            {
              isEmailValid ? <LiaCheckCircleSolid size={20} color="var(--mantine-color-green-7)" /> : <LiaTimesCircleSolid size={20} color="var(--mantine-color-red-7)" />
            }
          </>
          <Button size="xs" ml={'xs'} onClick={() => {
            app.toggleFormUpload(false)
            app.toggleFormRegister(true)
          }}>New</Button>
        </>}
        rightSectionWidth={92}
      />

      <Checkbox
        pt={'xs'}
        label="Remember"
        checked={remember}
        disabled={!form.values.creator}
        onChange={(e) => {
          const isChecked = e.currentTarget.checked
          setRemember(isChecked)
          localStorage.setItem('email_remember', isChecked.toString())
          if (isChecked && form.values.creator) {
            localStorage.setItem('email', form.values.creator)
          } else {
            localStorage.removeItem('email')
          }
        }}
      />

      <TextInput
        pt={'xs'}
        label="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />

      <TagsInput
        pt={'xs'}
        label="Tags"
        key={form.key('tags')}
        {...form.getInputProps('tags')}
      />

      <FileInput
        pt={'xs'}
        label="File"
        key={form.key('file')}
        {...form.getInputProps('file')}
      />

      <Group justify={error ? 'space-between' : 'flex-end'} mt="md">
        {
          error && <Text color="red" mr={'sm'}>{error}</Text>
        }
        <Button type="submit">Submit</Button>
      </Group>

    </form>
  </>;
}