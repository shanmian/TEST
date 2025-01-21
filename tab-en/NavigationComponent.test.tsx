import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import NavigationComponent from './NavigationComponent';

/**
 * Test suite for NavigationComponent
 */
describe('NavigationComponent', () => {
  afterEach(() => {
    cleanup();
  });

  // Test data
  const mockItems = ['Tab 1', 'Tab 2', 'Tab 3'];
  const mockContents = [
    <div key="1">Content 1</div>,
    <div key="2">Content 2</div>,
    <div key="3">Content 3</div>
  ];

  /**
   * Test default rendering in tabs mode
   */
  test('renders in tabs mode by default', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
      />
    );
    
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  /**
   * Test rendering in stepper mode
   */
  test('renders in stepper mode when specified', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
      />
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  /**
   * Test content change when clicking tabs
   */
  test('changes content when tab is clicked', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
      />
    );

    const tab2 = screen.getAllByText('Tab 2')[0];
    fireEvent.click(tab2);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  /**
   * Test content change when clicking steps
   */
  test('changes content when step is clicked', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
      />
    );

    const tab2 = screen.getAllByText('Tab 2')[0];
    fireEvent.click(tab2);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  /**
   * Test onChange callback when switching tabs
   */
  test('calls onChange callback when tab changes', () => {
    const handleChange = vi.fn();
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
        onChange={handleChange}
      />
    );

    const tab2 = screen.getAllByText('Tab 2')[0];
    fireEvent.click(tab2);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  /**
   * Test rendering with vertical orientation
   */
  test('renders with vertical orientation', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
        orientation="vertical"
      />
    );

    const tabs = screen.getAllByRole('tablist')[0];
    expect(tabs).toHaveAttribute('aria-orientation', 'vertical');
  });

  /**
   * Test starting from specified active index
   */
  test('starts from specified activeIndex', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
        activeIndex={1}
      />
    );

    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  /**
   * Test displaying fallback content when content is not available
   */
  test('displays fallback content when content is not available', () => {
    const incompleteContents = [<div key="1">Content 1</div>];
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={incompleteContents}
        activeIndex={1}
      />
    );

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });
});