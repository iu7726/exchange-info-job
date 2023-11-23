interface RebateInfo {
  totalIncome: string;
  convert: string;
  derivative: string;
  spot: string;
}

interface RebateDetail {
  rebateId: number;
  subAcct: string;
  income: string;
  incomeConvert: string;
  incomeDerivative: string;
  incomeSpot: string;
  markupFee: string;
  markupConvert: string;
  markupDerivative: string;
  markupSpot: string;
  netFee: string;
  netDerivative: string;
  netSpot: string;
  rebateDate: string;
  rebateunix: number;
}