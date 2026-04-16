import { Checkbox } from 'primereact/checkbox'

export default function TransactionList({ transactions = [] }) {
  const formatAmount = (amount) => {
    return amount.toLocaleString('ko-KR')
  }

  const getTypeColor = (type) => {
    switch (type) {
      case '수입':
        return 'color-blue'
      case '지출':
        return 'color-red'
      case '이체':
        return 'color-green'
      default:
        return ''
    }
  }

  const handleExecutedChange = (id) => {
    console.log(`Toggle executed for transaction ${id}`)
  }

  return (
    <div className="transaction-list">
      {transactions.length === 0 ? (
        <div className="empty-state">
          <p>거래 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="transaction-items">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-checkbox">
                <Checkbox
                  checked={transaction.gExecuted}
                  onChange={() => handleExecutedChange(transaction.id)}
                />
              </div>

              <div className="transaction-details">
                <div className="transaction-type-date">
                  <span className={`transaction-type ${getTypeColor(transaction.gType)}`}>
                    {transaction.gType}
                  </span>
                  <span className="transaction-date">{transaction.gDate}</span>
                </div>

                <div className="transaction-account-category">
                  <span className="transaction-account">{transaction.gAcc1}</span>
                  <span className="transaction-category">{transaction.gCategory}</span>
                </div>

                {transaction.gMemo && (
                  <div className="transaction-memo">{transaction.gMemo}</div>
                )}
              </div>

              <div className={`transaction-amount ${getTypeColor(transaction.gType)}`}>
                {formatAmount(transaction.gAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
