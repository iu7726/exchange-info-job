interface LastRebateDetail {
  rebate_unix: number;
}

interface RebateResponseDataDetail {
  income: string
  incomeCat: {
    convert: string
    derivative: string
    spot: string
  },
  markupFee: string
  markupFeeCat: {
    convert: string
    derivative: string
    spot: string
  },
  netFee: string
  netFeeCat: {
    derivative: string
    spot: string
  },
  rebateDate: string
  rebateTime: string
  subAcct: string
}

interface RebateResponseData {
  details: RebateResponseDataDetail[];
  page: string;
  totIncome: string;
  totIncomeCat: {
      convert: string
      derivative: string
      spot: string
  },
  totPage: string
  ts: string
}

interface RebateResponse {
  code: string;
  data: RebateResponseData[],
  msg: string;
}