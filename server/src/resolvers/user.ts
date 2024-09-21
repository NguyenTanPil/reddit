import argon2d from 'argon2';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { UserMutationResponse } from '../types/UserMutationResponse';
import { RegisterInput } from '../types/RegisterInput';
import { validateRegisterInput } from '../utils/validationInput';

@Resolver()
export class UserResolver {
	@Mutation((_returns) => UserMutationResponse, { nullable: true })
	async register(@Arg('registerInput') registerInput: RegisterInput): Promise<UserMutationResponse> {
		const validateRegisterInputError = validateRegisterInput(registerInput);

		if (validateRegisterInputError !== null) {
			return {
				code: 400,
				success: false,
				...validateRegisterInputError,
			};
		}

		try {
			const { email, username, password } = registerInput;
			const existingUser = await User.findOne({
				where: [
					{
						username,
					},
					{
						email,
					},
				],
			});

			if (existingUser) {
				return {
					code: 400,
					success: false,
					message: 'User already registered',
					errors: [
						{
							field: existingUser.username === username ? 'username' : 'email',
							message: `${existingUser.username === username ? 'Username' : 'Email'} already registered`,
						},
					],
				};
			}

			const hashPassword = await argon2d.hash(password);
			const newUser = User.create({
				username,
				email,
				password: hashPassword,
			});
			const createdUser = await User.save(newUser);

			return {
				code: 200,
				success: true,
				message: 'User registration successful',
				user: createdUser,
			};
		} catch (err) {
			return {
				code: 500,
				success: false,
				message: `Internal error: ${err.message}`,
			};
		}
	}
}
