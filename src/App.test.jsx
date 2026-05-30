// src/App.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders hero title', () => {
    render(<App />);
    expect(screen.getByText('EARNINGS.AI')).toBeInTheDocument();
  });

  it('renders hero subtitle', () => {
    render(<App />);
    expect(screen.getByText('90-minute calls. 30-second insights.')).toBeInTheDocument();
  });

  it('renders History button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
  });

  it('does not render results section before analysis', () => {
    render(<App />);
    expect(screen.queryByText(/financial highlights/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/key positives/i)).not.toBeInTheDocument();
  });
});
