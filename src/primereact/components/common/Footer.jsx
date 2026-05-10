import { TabMenu } from '@/assets/js/PrimeReact';

const templateItem = (item, index, onMenuChange) => {
  return (
    <a
      className="p-menuitem-link"
      onClick={(e) => {
        e.preventDefault();
        onMenuChange(index);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className="p-menuitem-icon">
        <i className={item.icon} />
      </div>
      <div className="p-menuitem-text text-lg">{item.label}</div>
    </a>
  );
};

export default function Footer({ activeIndex, onMenuChange }) {
  const menuItems = [
    {
      label: '가계부',
      icon: 'pi pi-book',
      template: (item) => templateItem(item, 0, onMenuChange),
    },
    {
      label: '자산',
      icon: 'pi pi-wallet',
      template: (item) => templateItem(item, 1, onMenuChange),
    },
    {
      label: '통계',
      icon: 'pi pi-chart-bar',
      template: (item) => templateItem(item, 2, onMenuChange),
    },
    {
      label: '설정',
      icon: 'pi pi-cog',
      template: (item) => templateItem(item, 3, onMenuChange),
    },
  ];

  return (
    <footer className="app-footer">
      <TabMenu
        model={menuItems}
        activeIndex={activeIndex}
        onTabChange={(e) => onMenuChange(e.index)}
      />
    </footer>
  );
}
