import { TabView, TabPanel } from '@/components/PrimeReact';
import Calendar from '@/pages/Ledger/Calendar';
import List from '@/pages/Ledger/List';
import Repeat from '@/pages/Ledger/Repeat';

export default function Ledger() {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="app-page ledger-page">
      <TabView className="ledger-tabview">
        <TabPanel header={<span className="text-lg">달력</span>} leftIcon="pi pi-calendar mr-2">
          <Calendar />
        </TabPanel>
        <TabPanel header={<span className="text-lg">목록</span>} leftIcon="pi pi-list-check mr-2" className="px-0">
          <List />
        </TabPanel>
        <TabPanel header={<span className="text-lg">반복</span>} leftIcon="pi pi-clone mr-2" className="px-0">
          <Repeat />
        </TabPanel>
      </TabView>
    </div>
  );
}
