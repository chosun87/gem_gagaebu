import { useState } from 'react';
import { TabMenu } from '@/components/PrimeReact';

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: '가계부', icon: 'pi pi-book' },
    { label: '통계', icon: 'pi pi-chart-bar' },
    { label: '자산', icon: 'pi pi-wallet' },
    { label: '설정', icon: 'pi pi-cog' }
  ];

  return (
    <footer className="app-footer">
      <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      />
    </footer>
  );
}
