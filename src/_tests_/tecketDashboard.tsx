// tests/TicketDashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

jest.mock('../data/sampleTickets.json', () => [
  {
    id: 'TKT-1001',
    title: 'Login failure',
    customer: 'Acme Corp',
    customerEmail: 'support@acme.com',
    priority: 'High',
    status: 'Open',
    createdAt: '2025-05-01T10:15:00Z',
    updatedAt: '2025-05-01T14:30:00Z',
    description: 'Redirect loop in Safari',
    category: 'Auth',
  },
  {
    id: 'TKT-1002',
    title: 'Dashboard bug',
    customer: 'Tech LLC',
    customerEmail: 'support@tech.com',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2025-04-30T08:22:00Z',
    updatedAt: '2025-05-01T09:15:00Z',
    description: 'Dashboard data stale',
    category: 'UI',
  },
]);

describe('Support Ticket Dashboard', () => {
  test('renders ticket cards with mock data', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/login failure/i)).toBeInTheDocument());
    expect(screen.getByText(/Dashboard bug/i)).toBeInTheDocument();
  });

  test('filters tickets by status', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/login failure/i)).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Open' } });
    expect(screen.getByText(/login failure/i)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard bug/i)).not.toBeInTheDocument();
  });

  test('updates status inline', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/dashboard bug/i)).toBeInTheDocument());

    const select = screen.getAllByRole('combobox')[1];
    fireEvent.change(select, { target: { value: 'Closed' } });
    expect((select as HTMLSelectElement).value).toBe('Closed');
  });

  test('searches tickets by keyword', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/login failure/i)).toBeInTheDocument());

    const input = screen.getByPlaceholderText(/search by title or customer/i);
    fireEvent.change(input, { target: { value: 'Tech' } });
    expect(screen.getByText(/dashboard bug/i)).toBeInTheDocument();
    expect(screen.queryByText(/login failure/i)).not.toBeInTheDocument();
  });
});
