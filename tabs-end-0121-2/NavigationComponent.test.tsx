import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import NavigationComponent from './NavigationComponent';
import '@testing-library/jest-dom';

describe('NavigationComponent', () => {
  // Test data
  const mockItems = ['Tab 1', 'Tab 2', 'Tab 3'];
  const mockContents = [
    <div key="1">Content 1</div>,
    <div key="2">Content 2</div>,
    <div key="3">Content 3</div>
  ];

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

  test('changes content when tab is clicked', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
      />
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  test('changes content when step is clicked', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
      />
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  test('calls onChange callback when tab changes', () => {
    const handleChange = vi.fn();
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  test('renders with vertical orientation', () => {
    render(
      <NavigationComponent
        items={mockItems}
        contents={mockContents}
        orientation="vertical"
      />
    );

    const tabs = screen.getByRole('tablist');
    expect(tabs).toHaveAttribute('aria-orientation', 'vertical');
  });

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

  test('stepper mode button operations', () => {
    const handleFinish = vi.fn();
    const handleCancel = vi.fn();

    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
        onFinish={handleFinish}
        onCancel={handleCancel}
        showNextButton={true}
        showBackButton={true}
        showFinishButton={true}
        showCancelButton={true}
      />
    );

    // Test Next button
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();

    // Test Back button
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    // Test Cancel button
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalled();

    // Navigate to last step and test Finish button
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Finish'));
    expect(handleFinish).toHaveBeenCalled();
  });

  test('stepper mode button visibility control', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
        showNextButton={false}
        showBackButton={false}
        showFinishButton={false}
        showCancelButton={false}
      />
    );

    // Verify buttons are not rendered
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
    expect(screen.queryByText('Finish')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('stepper mode first step back button disabled', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
        showBackButton={true}
      />
    );

    const backButton = screen.getByText('Back');
    expect(backButton).toBeDisabled();
  });

  test('stepper mode last step shows finish instead of next', () => {
    render(
      <NavigationComponent
        type="stepper"
        items={mockItems}
        contents={mockContents}
        showNextButton={true}
        showFinishButton={true}
        onFinish={() => {}}
        activeIndex={2}
      />
    );

    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });
});