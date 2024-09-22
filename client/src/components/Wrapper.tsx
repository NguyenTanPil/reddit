import { Box } from '@chakra-ui/react';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Wrapper = ({ children }: Props) => {
	return (
		<Box
			maxW='400px'
			w='100%'
			mt={8}
			mx='auto'
		>
			{children}
		</Box>
	);
};

export default Wrapper;
