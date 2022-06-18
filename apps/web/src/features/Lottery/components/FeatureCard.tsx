import { Box, Heading } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type FeatureCardProps = {
  heading: string;
  children: ReactNode;
};

export const FeatureCard: FC<FeatureCardProps> = ({
  heading,
  children,
}: FeatureCardProps) => {
  return (
    <Box bg="blackAlpha.600" borderRadius="lg" w="100%">
      <Heading
        bg="blackAlpha.600"
        color="white"
        borderRadius="lg"
        p="3"
        size="lg"
        textTransform="uppercase"
        textAlign="center"
      >
        {heading}
      </Heading>
      <Box p="3" color="white" fontSize="lg">
        {children}
      </Box>
    </Box>
  );
};
