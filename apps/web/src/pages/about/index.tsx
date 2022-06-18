import { Box, Center, Heading, Link, Text } from '@chakra-ui/react';
import { NextPage } from 'next';

const AboutPage: NextPage = () => {
  return (
    <Center>
      <Box bg="white" borderRadius="lg" p={5} maxW={800}>
        <Heading size="xl" textTransform="uppercase">
          About the Lottery
        </Heading>

        <Heading size="lg" mt={5}>
          What is The Lottery?
        </Heading>

        <Text fontSize="lg" mt={3}>
          The Lottery is a decentralized application that sells tickets to join
          the lottery. Collected mock tokens will be transferred to a single
          winner.
        </Text>

        <Heading size="lg" mt={5}>
          How does it work?
        </Heading>

        <Text fontSize="lg" mt={3}>
          When you purchase a lottery ticket by pressing the Buy button on the
          top page, required mock tokens will be sent to the lottery contract.
          The amount of the prize pool, minus certain fees, will be displayed in
          the upper left corner of the top page.
        </Text>

        <Text fontSize="lg" mt={3}>
          When the administrator draws the lottery, the full amount of the prize
          pool will be sent to one of the ticket buyers.
        </Text>

        <Heading size="lg" mt={5}>
          How can I buy tickets?
        </Heading>

        <Text fontSize="lg" mt={3}>
          Mock tokens are required to buy lottery tickets. Mock tokens are ERC20
          tokens issued by me. If you need some, please send a message to{' '}
          <Link href="https://twitter.com/shrry2" isExternal>
            @shrry2 on Twitter
          </Link>
          .
        </Text>

        <Text fontSize="lg" mt={3}>
          Once you get MockToken, you can buy tickets by pressing the Buy button
          on the top page. To allow the transfer of MockToken, you need to
          approve the lottery contract to spend the MockToken before calling
          lottery contract, so Metamask prompt will be shown twice. Please
          confirm both of them.
        </Text>

        <Heading size="lg" mt={5}>
          The lottery not have been drawn for a long time?
        </Heading>

        <Text fontSize="lg" mt={3}>
          Due to technical issues, only I, the administrator, can draw the
          lottery; please let me know via{' '}
          <Link href="https://twitter.com/shrry2" isExternal>
            Twitter
          </Link>{' '}
          🙏
        </Text>
      </Box>
    </Center>
  );
};

export default AboutPage;
