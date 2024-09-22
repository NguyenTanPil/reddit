import { Box, Button } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { RegisterInput, useRegisterMutation } from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldErrors';
import { useRouter } from 'next/router';

const Register = () => {
	const initialValues: RegisterInput = {
		email: '',
		username: '',
		password: '',
	};

	const router = useRouter();
	const [registerUser, { data, error, loading: _registerUserLoading }] = useRegisterMutation();

	const handleRegistration = async (values: RegisterInput, { setErrors }: FormikHelpers<RegisterInput>) => {
		const response = await registerUser({
			variables: {
				registerInput: values,
			},
		});

		if (response.data?.register.errors) {
			const errorObject = mapFieldErrors(response.data?.register.errors);
			setErrors(errorObject);
		} else if (response.data?.register.success) {
			router.push('/');
		}
	};

	return (
		<Wrapper>
			<Formik
				initialValues={initialValues}
				onSubmit={handleRegistration}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='email'
							placeholder='Email'
							label='Email'
						/>
						<Box mt={4}>
							<InputField
								name='username'
								placeholder='Username'
								label='Username'
							/>
						</Box>
						<Box mt={4}>
							<InputField
								name='password'
								placeholder='Password'
								label='Password'
								type='password'
							/>
						</Box>
						<Button
							type='submit'
							colorScheme='teal'
							mt={4}
							isLoading={isSubmitting}
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;
