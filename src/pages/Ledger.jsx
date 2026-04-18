import { TabView, TabPanel } from '@/components/PrimeReact';
import Calendar from '@/pages/Ledger/Calendar';
import List from '@/pages/Ledger/List';

export default function Ledger() {

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <div className="ledger-page">
      <TabView className="ledger-tabview">
        <TabPanel header="달력" leftIcon="pi pi-calendar mr-2">
          <Calendar />
        </TabPanel>
        <TabPanel header="목록" leftIcon="pi pi-list mr-2" className="px-0">
          <List />
        </TabPanel>
      </TabView>
    </div>
  );
}
