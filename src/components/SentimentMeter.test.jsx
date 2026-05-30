import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SentimentMeter from './SentimentMeter';

describe('SentimentMeter', () => {
  it('renders three tick labels', () => {
    render(<SentimentMeter sentiment="Bullish" />);
    expect(screen.getByText('Bearish')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Bullish')).toBeInTheDocument();
  });

  it.each([
    ['Bearish', '10%'],
    ['Neutral', '50%'],
    ['Bullish', '90%'],
  ])('positions marker correctly for %s', (sentiment, expectedLeft) => {
    const { container } = render(<SentimentMeter sentiment={sentiment} />);
    const marker = container.querySelector('.meter-marker');
    expect(marker.style.left).toBe(expectedLeft);
  });

  it('defaults to 50% for unknown sentiment', () => {
    const { container } = render(<SentimentMeter sentiment="Unknown" />);
    const marker = container.querySelector('.meter-marker');
    expect(marker.style.left).toBe('50%');
  });
});
