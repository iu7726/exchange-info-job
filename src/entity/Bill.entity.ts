interface Bill {
  billId: string;
  bal: string;
  balChg: string;
  ccy: string;
  execType: string;
  fee: string;
  fillFwdPx: string;
  fillIdxPx: string;
  fillMarkPx: string;
  fillMarkVol: string;
  fillPxUsd:string;
  fillPxVol: string;
  fillTime: string;
  instId: string;
  instType: string;
  interest: string;
  mgnMode: string;
  notes: string;
  ordId: string;
  pnl: string;
  posBal: string;
  posBalChg: string;
  px: string;
  subType: string;
  sz: string;
  tradeId: string;
  ts: string;
  raw: string;
}

interface BillResponse {
  code: string;
  data: Bill[],
  msg: string;
}