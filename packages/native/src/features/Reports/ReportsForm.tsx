import React, { useState } from 'react'
import {
  Alert,
  Input,
  TextArea,
  FormControl,
  Button,
  VStack,
  Checkbox,
  Select,
  CheckIcon,
} from 'native-base'
// import { TextInput } from '../../components/Inputs/TextInput'

import { useReportsSubmitAbuseMutation } from '../../graphql/Reports/Reports.generated'
import { PairUp } from '@pairup/shared/types'

export const ReportsForm = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    isAbuserPairer: false,
    abuseType: '',
  })
  const [errors, setErrors] = useState({ name: '', email: '', description: '' })

  const [{ data, fetching, error }, submitReport] =
    useReportsSubmitAbuseMutation()

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  // if (fetching) {
  //   return <Alert status="info">Loading...</Alert>
  // }

  if (error) {
    return <Alert status="error">Oh no! There was an error!</Alert>
  }

  // if (data) {
  //   return (
  //     <>
  //       <Alert status="success">
  //         Your form has been successfully submitted!
  //       </Alert>
  //       <Button onPress={() => navigation.navigate('home')}>Go Back</Button>
  //     </>
  //   )
  // }

  // [x]---------------------------TEMP FUNCTION
  // remove: -----------------------------------
  const successRes = () => {
    return (
      <>
        <Alert status="success">
          Your form has been successfully submitted!
        </Alert>
        <Button onPress={() => navigation.navigate('home')}>Go Back</Button>
      </>
    )
  }

  // [x]------------------------------- VALIDATE FUNCTIONS
  const validateName = () => {
    if (formData.name.length === 0) {
      setErrors({ ...errors, name: 'Name is required' })
      return false
    } else if (formData.name.length < 3) {
      setErrors({ ...errors, name: 'Name is too short' })
      return false
    } else {
      setErrors({ ...errors, name: '' })
    }
    return true
  }

  const validateEmail = () => {
    if (!emailRegex.test(formData.email)) {
      setErrors({ ...errors, email: 'Invalid email' })
      return false
    } else {
      setErrors({ ...errors, email: '' })
    }
    return true
  }

  const validateDescription = () => {
    if (formData.description.length === 0) {
      setErrors({ ...errors, description: 'Description is required' })
    } else if (formData.description.length >= 500) {
      setErrors({ ...errors, description: '500 words max' })
    } else {
      setErrors({ ...errors, description: '' })
    }
    return true
  }
  const validate = () => {
    if (validateName() && validateEmail() && validateDescription()) return true
  }

  // [x]------------------------------------ SUBMIT FUNCTION
  const handleSubmit = async () => {
    try {
      if (validate()) {
        await submitReport({
          report: {
            name: formData.name,
            email: formData.email,
            description: 'Annoying emails',
            isAbuserPairer: false,
            abuseType: PairUp.Abuse.SomethingElse,
          },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <VStack bg={'muted.50'} space="8">
      {/* [x] ------------------------- NAME */}
      <FormControl isRequired isInvalid={'name' in errors}>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Name
        </FormControl.Label>
        <Input
          placeholder="Name"
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          onBlur={validateName}
        />
        {'name' in errors ? (
          <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>
            Name should contain at least 3 character.
          </FormControl.HelperText>
        )}
      </FormControl>

      {/* [x] ------------------------- EMAIL */}

      <FormControl isRequired isInvalid={'email' in errors}>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Email
        </FormControl.Label>

        <Input
          placeholder="Email"
          onChangeText={(value) => setFormData({ ...formData, email: value })}
          onBlur={validateEmail}
        />
        {'email' in errors ? (
          <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>
            Please enter a valid email address!
          </FormControl.HelperText>
        )}
      </FormControl>

      {/* [x] ------------------------- DESCRIPTION */}

      <FormControl isRequired isInvalid={'description' in errors}>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Brief description of the incident
        </FormControl.Label>

        <TextArea
          placeholder="500 words max"
          onChangeText={(value) =>
            setFormData({ ...formData, description: value })
          }
          onBlur={validateDescription}
        />
        {'description' in errors ? (
          <FormControl.ErrorMessage>
            {errors.description}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>Description required!</FormControl.HelperText>
        )}
      </FormControl>

      {/* [x] ------------------------- CHECKBOX */}

      <FormControl>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Is the abuser a Pairer?
        </FormControl.Label>

        <Checkbox value="pairer" accessibilityLabel="Is the abuser a Pairer?">
          Is the abuser a Pairer?
        </Checkbox>
      </FormControl>

      {/* [x] ------------------------- ABUSE TYPE DROPDOWN */}
      <FormControl isRequired>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Type of abuse
        </FormControl.Label>

        <Select
          selectedValue={formData.abuseType}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Type of abuse"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, abuseType: itemValue })
          }
        >
          <Select.Item
            label="Harassment or Bullying"
            value={PairUp.Abuse.HarassmentOrBullying}
          />
          <Select.Item
            label="Pretending to be someone"
            value={PairUp.Abuse.PretendingToBeSomeone}
          />
          <Select.Item
            label="Spam or harmful"
            value={PairUp.Abuse.SpamOrHarmful}
          />
          <Select.Item
            label="Something else"
            value={PairUp.Abuse.SomethingElse}
          />
        </Select>
      </FormControl>

      {/* [x] ------------------------- SUBMIT BUTTON */}

      <Button
        mt="4"
        onPress={async () => {
          await handleSubmit()
          successRes()
        }}
      >
        Submit
      </Button>
    </VStack>
  )
}
