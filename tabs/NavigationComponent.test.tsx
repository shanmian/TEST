import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import NavigationComponent from './NavigationComponent';

/**
 * NavigationComponent组件的测试套件
 */
describe('NavigationComponent', () => {
  afterEach(() => {
    cleanup();
  });

  // 测试数据
  const mockItems = ['Tab 1', 'Tab 2', 'Tab 3'];
  const mockContents = [
    <div key="1">Content 1</div>,
    <div key="2">Content 2</div>,
    <div key="3">Content 3</div>
  ];

  /**
   * 测试默认渲染为标签页模式
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
   * 测试步骤条模式的渲染
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
   * 测试标签页点击切换内容
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
   * 测试步骤条点击切换内容
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
   * 测试切换标签时的回调函数
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
   * 测试垂直方向的渲染
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
   * 测试指定初始激活索引
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
   * 测试内容不可用时显示后备内容
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

    expect(screen.getByText('暂无内容')).toBeInTheDocument();
  });
});