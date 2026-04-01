import { render } from '@testing-library/react';
import AiChat from './AiChat';

test('renders AiChat component', () => {
  const { getByText } = render(<AiChat />);
  const headerElement = getByText(/Asystent AI/i);
  expect(headerElement).toBeInTheDocument();
});
