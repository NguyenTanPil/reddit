import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';

type Props = {
	name: string;
	label: string;
	placeholder: string;
	type?: string;
};

const InputField = (props: Props) => {
	const [field, { error, touched }] = useField(props);

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{props.label}</FormLabel>
			<Input
				id={field.name}
				{...props}
				{...field}
			/>
			{error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
		</FormControl>
	);
};

export default InputField;
