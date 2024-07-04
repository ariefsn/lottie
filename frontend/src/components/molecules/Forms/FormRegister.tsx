'use client'

import { UserInput } from "@/graphql.generated";
import { parseGqlError } from "@/helper";
import { useOActions, useOEffects } from "@/store";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export default function FormRegister() {
  const { app } = useOActions()
  const { gql } = useOEffects()
  const [error, setError] = useState<string>('')

  const form = useForm<UserInput>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      firstName: (value) => (value.length > 0 ? null : 'First name is required'),
      lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
    },
    onValuesChange: (values) => setError(''),
  })

  const onSubmit = async (values: typeof form.values) => {
    const res = form.validate()
    if (res.hasErrors) return

    try {
      app.toggleLoading();
      const resCreate = await gql.mutations.USER_CREATE({ input: values })
      app.pushNotif({
        title: 'Success',
        message: 'User created',
      })
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
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <TextInput
        mt={'xs'}
        label="First Name"
        key={form.key('firstName')}
        {...form.getInputProps('firstName')}
      />

      <TextInput
        mt={'xs'}
        label="Last Name"
        key={form.key('lastName')}
        {...form.getInputProps('lastName')}
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