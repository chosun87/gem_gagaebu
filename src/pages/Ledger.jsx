import { TabView, TabPanel } from '@/components/PrimeReact';
import Calendar from '@/pages/Ledger/Calendar';
import List from '@/pages/Ledger/List';
import Repeat from '@/pages/Ledger/Repeat';

export default function Ledger() {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="ledger-page">
      <TabView className="ledger-tabview">
        <TabPanel header="달력" leftIcon="pi pi-calendar mr-2">
          <Calendar />
        </TabPanel>
        <TabPanel header="목록" leftIcon="pi pi-list-check mr-2" className="px-0">
          <List />
        </TabPanel>
        <TabPanel header="반복" leftIcon="pi pi-clone mr-2" className="px-0">
          <Repeat />
        </TabPanel>
      </TabView>
    </div>
  );
}
