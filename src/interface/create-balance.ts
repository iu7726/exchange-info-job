interface BalanceDetail {
  availBal: string
  availEq: string
  borrowFroz: string
  cashBal: string
  ccy: string
  crossLiab: string
  disEq: string
  eq: string
  eqUsd: string
  fixedBal: string
  frozenBal: string
  interest: string
  isoEq: string
  isoLiab: string
  isoUpl: string
  liab: string
  maxLoan: string
  mgnRatio: string
  notionalLever: string
  ordFrozen: string
  spotInUseAmt: string
  stgyEq: string
  twap: string
  uTime: string
  upl: string
  uplLiab: string
}

interface Balance {
  adjEq: string
  borrowFroz: string
  details: Array<Balance>,
  imr: string
  isoEq: string
  mgnRatio: string
  mmr: string
  notionalUsd: string
  ordFroz: string
  totalEq: string
  uTime: string
}

interface CreateBalance {
  account_id: number
  user_id: number
  balance: Balance
}