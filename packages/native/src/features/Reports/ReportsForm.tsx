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

import { useReportsSubmitAbuseMutation } from '../../graphql/Reports/Reports.generated'
import { PairUp } from '@pairup/shared/types'

import {
  abuseReportSchema,
  ABUSE_TYPE_OPTIONS,
} from '@pairup/shared/src/references/zodSchemas'

export const ReportsForm = ({ navigation }: any) => {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    description: string
    isAbuserPairer: boolean
    abuseType: PairUp.Abuse | null
  }>({
    name: '',
    email: '',
    description: '',
    isAbuserPairer: false,
    abuseType: null,
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    description: '',
    abuseType: '',
  })

  const [{ data, fetching, error }, submitReport] =
    useReportsSubmitAbuseMutation()

  // :: DATA coming back from GraphQL - - - - - - - - - - - - - - - - -  - - - - -  -
  if (fetching) {
    return <Alert status="info">Loading...</Alert>
  }

  if (error) {
    return (
      <>
        <Alert status="error">Oh no :( There was an error in your form!</Alert>
        <Button
          onPress={() =>
            navigation.reset({
              index: 1,
              routes: [{ name: 'reports' }],
            })
          }
        >
          Refill form
        </Button>
      </>
    )
  }

  if (data) {
    return (
      <>
        <Alert status="success">
          Your form has been successfully submitted!
        </Alert>
        <Button onPress={() => navigation.navigate('home')}>Go Back</Button>
      </>
    )
  }

  const enumToZod = (abuseTypeValue: PairUp.Abuse | null) => {
    if (abuseTypeValue === 'HARASSMENT_OR_BULLYING') {
      return ABUSE_TYPE_OPTIONS[1]
    } else if (abuseTypeValue === 'PRETENDING_TO_BE_SOMEONE') {
      return ABUSE_TYPE_OPTIONS[2]
    } else if (abuseTypeValue === 'SOMETHING_ELSE') {
      return ABUSE_TYPE_OPTIONS[3]
    } else return ABUSE_TYPE_OPTIONS[0]
  }

  // [x]------------------------------------ SUBMIT FUNCTION
  const handleSubmit = async () => {
    try {
      const parsedData = abuseReportSchema.parse({
        name: formData.name,
        email: formData.email,
        description: formData.description,
        isAbuserPairer: formData.isAbuserPairer,
        abuseType: enumToZod(formData.abuseType),
      })
      await submitReport({
        report: {
          name: parsedData.name,
          email: parsedData.email,
          description: parsedData.description,
          isAbuserPairer: parsedData.isAbuserPairer,
          abuseType: formData.abuseType as PairUp.Abuse,
        },
      })
      // await submitReport({
      //   report: {
      //     name: formData.name,
      //     email: formData.email,
      //     description: formData.description,
      //     isAbuserPairer: formData.isAbuserPairer,
      //     abuseType: formData.abuseType as PairUp.Abuse,
      //   },
      // })
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
      {/* note: ------------------ OPEN BUG 🐞 */}

      <FormControl>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Is the abuser a Pairer?
        </FormControl.Label>

        <Checkbox
          onChange={() => {
            setFormData((state) => ({
              ...state,
              isAbuserPairer: !formData.isAbuserPairer,
            }))
          }}
          isChecked={formData.isAbuserPairer}
          value="pairer"
          accessibilityLabel="Is the abuser a Pairer?"
        />
      </FormControl>

      {/* [x] ------------------------- ABUSE TYPE DROPDOWN */}
      {/* ::----------------------------------------------- */}
      <FormControl isRequired>
        <FormControl.Label
          _text={{
            bold: true,
          }}
        >
          Type of abuse
        </FormControl.Label>

        <Select
          selectedValue={formData.abuseType as string}
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Type of abuse"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, abuseType: itemValue as PairUp.Abuse })
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
        {'abuseType' in errors ? (
          <FormControl.ErrorMessage>
            {errors.abuseType}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText>Field required!</FormControl.HelperText>
        )}
      </FormControl>

      {/* [x] ------------------------- SUBMIT BUTTON */}

      <Button mt="4" onPress={handleSubmit}>
        Submit
      </Button>
    </VStack>
  )
}
