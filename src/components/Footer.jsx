import { TabMenu } from '@/assets/js/PrimeReact';

export default function Footer({ activeIndex, onMenuChange }) {
  const itemRenderer = (item, index) => {
    return (
      <a className='p-menuitem-link'
        onClick={(e) => {
          e.preventDefault();
          onMenuChange(index);
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="p-menuitem-icon"><i className={item.icon} /></div>
        <div className="p-menuitem-text text-lg">{item.label}</div>
      </a>
    );
  }

  const menuItems = [
    {
      label: '가계부', icon: 'pi pi-book',
      template: (item) => itemRenderer(item, 0)
    },
    {
      label: '통계', icon: 'pi pi-chart-bar',
      template: (item) => itemRenderer(item, 1)
    },
    {
      label: '자산', icon: 'pi pi-wallet',
      template: (item) => itemRenderer(item, 2)
    },
    {
      label: '설정', icon: 'pi pi-cog',
      template: (item) => itemRenderer(item, 3)
    }
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

