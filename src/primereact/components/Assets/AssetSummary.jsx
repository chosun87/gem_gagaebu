import { DataTable, Column } from '@/assets/js/PrimeReact';
import { TRANSACTION_TYPE } from '@/assets/js/constants';

export default function LedgerSummary({ summary }) {
  const summaryA = [];

  if (
    !(
      summary?.income0 === 0 &&
      summary?.income1 === 0 &&
      summary?.incomeA === 0
    )
  ) {
    summaryA.push({
      gType: TRANSACTION_TYPE.INCOME,
      실행전: summary?.income0 || 0,
      실행후: summary?.income1 || 0,
      합계: summary?.incomeA || 0,
    });
  }
  if (
    !(
      summary?.expense0 === 0 &&
      summary?.expense1 === 0 &&
      summary?.expenseA === 0
    )
  ) {
    summaryA.push({
      gType: TRANSACTION_TYPE.EXPENSE,
      실행전: summary?.expense0 || 0,
      실행후: summary?.expense1 || 0,
      합계: summary?.expenseA || 0,
    });
  }
  if (
    !(
      summary?.transfer0 === 0 &&
      summary?.transfer1 === 0 &&
      summary?.transferA === 0
    )
  ) {
    summaryA.push({
      gType: TRANSACTION_TYPE.TRANSFER,
      실행전: summary?.transfer0 || 0,
      실행후: summary?.transfer1 || 0,
      합계: summary?.transferA || 0,
    });
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateAmountBody = (rowData, field) => {
    return <>{(rowData[field] || 0).toLocaleString()}</>;
  };

  return (
    summaryA.length > 0 && (
      <DataTable
        className="p-datatable-sm"
        responsiveLayout="scroll"
        value={summaryA}
      >
        <Column
          field="gType"
          header="구분"
          align="center"
          bodyClassName={(rowData) => `px-0 font-bold gType-${rowData.gType}`}
          style={{ width: '10%', minWidth: '4rem' }}
        />
        <Column
          field="실행전"
          header="실행전"
          alignHeader="center"
          bodyClassName={(rowData) => `amount gType-${rowData.gType}`}
          body={(rowData) => templateAmountBody(rowData, '실행전')}
          style={{ width: '30%' }}
        />
        <Column
          field="실행후"
          header="실행후"
          alignHeader="center"
          bodyClassName={(rowData) => `amount gType-${rowData.gType}`}
          body={(rowData) => templateAmountBody(rowData, '실행후')}
          style={{ width: '30%' }}
        />
        <Column
          field="합계"
          header="합계"
          alignHeader="center"
          bodyClassName={(rowData) => `amount gType-${rowData.gType}`}
          body={(rowData) => templateAmountBody(rowData, '합계')}
          style={{ width: '30%' }}
        />
      </DataTable>
    )
  );
}
