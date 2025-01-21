import NavigationComponent from './NavigationComponent';

const MyTabs = () => {
  const items = ['第一步', '第二步', '第三步'];
  const contents = [
    <div>第一步的内容</div>,
    <div>第二步的内容</div>,
    <div>第三步的内容</div>
  ];

  return (
    <div>
      {/* Tabs 模式 */}
      <NavigationComponent
        type="tabs"
        items={items}
        contents={contents}
        onChange={(index) => console.log('当前索引:', index)}
      />

      {/* Stepper 模式 */}
      <NavigationComponent
        type="stepper"
        items={items}
        contents={contents}
        orientation="horizontal"
      />
    </div>
  );
};

export default MyTabs;