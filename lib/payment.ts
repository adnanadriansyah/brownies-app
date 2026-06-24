export interface BankAccount {
  bank: string
  name: string
  accountNumber: string
  logo?: string
}

export const bankAccounts: BankAccount[] = [
  { bank: 'BCA', name: 'Velours Brownies', accountNumber: '1234567890' },
  { bank: 'BRI', name: 'Velours Brownies', accountNumber: '0987654321' },
  { bank: 'Mandiri', name: 'Velours Brownies', accountNumber: '1122334455' },
  { bank: 'DANA', name: 'velours@dana', accountNumber: '081234567890' },
]
