import { render } from '@testing-library/react';
import AiChat from './AiChat';

test('renders AiChat component', () => {
  const { getByText } = render(<AiChat />);
  const linkElement = getByText(/Start chatting/i);
  expect(linkElement).toBeInTheDocument();
});
