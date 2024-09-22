import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
	return (
		<Box
			bg='tan'
			p={4}
		>
			<Flex
				maxW={800}
				justifyContent='space-between'
				alignItems='center'
				m='auto'
			>
				<NextLink href='/'>
					<Heading>Reddit</Heading>
				</NextLink>
				<Flex>
					<NextLink href='/login'>
						<Text mr={4}>Login</Text>
					</NextLink>
					<NextLink href='/register'>
						<Text>Register</Text>
					</NextLink>
				</Flex>
			</Flex>
		</Box>
	);
};

export default Navbar;
