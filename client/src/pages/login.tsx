import { Box, Button } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { LoginInput, useLoginMutation } from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldErrors';

const Login = () => {
	const initialValues: LoginInput = {
		usernameOrEmail: '',
		password: '',
	};

	const router = useRouter();
	const [loginUser, { data, error, loading: _loginUserLoading }] = useLoginMutation();

	const handleLogin = async (values: LoginInput, { setErrors }: FormikHelpers<LoginInput>) => {
		const response = await loginUser({
			variables: {
				loginInput: values,
			},
		});

		if (response.data?.login.errors) {
			const errorObject = mapFieldErrors(response.data?.login.errors);
			setErrors(errorObject);
		} else if (response.data?.login.success) {
			router.push('/');
		}
	};

	return (
		<Wrapper>
			<Formik
				initialValues={initialValues}
				onSubmit={handleLogin}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name='usernameOrEmail'
							placeholder='Username or email'
							label='Username or email'
						/>
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
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;
