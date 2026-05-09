import { DataTable, Column, ColumnGroup, Row } from '@/assets/js/PrimeReact';
import { TRANSACTION_TYPE } from '@/assets/js/constants';

export default function AssetSummary({ summary }) {
  const summaryA = [];

  if (
    !(
      summary?.deposit0 === 0 &&
      summary?.deposit1 === 0 &&
      summary?.depositA === 0
    )
  ) {
    summaryA.push({
      Trans: TRANSACTION_TYPE.DEPOSIT,
      실행전: summary?.deposit0 || 0,
      실행후: summary?.deposit1 || 0,
      합계: summary?.depositA || 0,
    });
  }
  if (
    !(
      summary?.withdraw0 === 0 &&
      summary?.withdraw1 === 0 &&
      summary?.withdrawA === 0
    )
  ) {
    summaryA.push({
      Trans: TRANSACTION_TYPE.WITHDRAW,
      실행전: summary?.withdraw0 || 0,
      실행후: summary?.withdraw1 || 0,
      합계: summary?.withdrawA || 0,
    });
  }

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const templateAmountBody = (rowData, field) => {
    return <>{(rowData[field] || 0).toLocaleString()}</>;
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="합계" align="center" />
        <Column
          footer={(summary?.deposit0 - summary?.withdraw0).toLocaleString()}
          align="right"
          className="amount"
        />
        <Column
          footer={(summary?.deposit1 - summary?.withdraw1).toLocaleString()}
          align="right"
          className="amount"
        />
        <Column
          footer={(summary?.depositA - summary?.withdrawA).toLocaleString()}
          align="right"
          className="amount"
        />
      </Row>
    </ColumnGroup>
  );

  return (
    summaryA.length > 0 && (
      <DataTable
        className="p-datatable-sm"
        responsiveLayout="scroll"
        value={summaryA}
        footerColumnGroup={footerGroup}
      >
        <Column
          field="Trans"
          header="구분"
          align="center"
          bodyClassName={(rowData) => `px-0 font-bold trans-${rowData.Trans}`}
          style={{ width: '10%', minWidth: '4rem' }}
        />
        {['실행전', '실행후', '합계'].map((field) => (
          <Column
            key={field}
            field={field}
            header={field}
            alignHeader="center"
            bodyClassName={(rowData) => `amount trans-${rowData.Trans}`}
            body={(rowData) => templateAmountBody(rowData, field)}
            style={{ width: '30%' }}
          />
        ))}
      </DataTable>
    )
  );
}
