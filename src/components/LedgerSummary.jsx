import React from 'react';

export default function LedgerSummary({ symmary }) {
  if (!symmary) return null;
  if (!(symmary?.incomeA > 0 || symmary?.expenseA > 0 || symmary?.transferA > 0)) return

  return (
    <div className="ledger-summary-wrap monospace">
      <table>
        <colgroup>
          <col style={{ width: "10%", minWidth: "3.5rem" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="text-left">구분</th>
            <th className="text-right">실행 전</th>
            <th className="text-right">실행 완료</th>
            <th className="text-right">합계</th>
          </tr>
        </thead>
        <tbody>
          {symmary?.incomeA > 0 &&
            <tr>
              <th className="text-left">수입</th>
              <td className="text-right">{(symmary?.income0 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.income1 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.incomeA || 0).toLocaleString()}</td>
            </tr>
          }
          {symmary?.expenseA > 0 &&
            <tr>
              <th className="text-left">지출</th>
              <td className="text-right">{(symmary?.expense0 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.expense1 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.expenseA || 0).toLocaleString()}</td>
            </tr>
          }
          {symmary?.transferA > 0 &&
            <tr>
              <th className="text-left">이체</th>
              <td className="text-right">{(symmary?.transfer0 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.transfer1 || 0).toLocaleString()}</td>
              <td className="text-right">{(symmary?.transferA || 0).toLocaleString()}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}
