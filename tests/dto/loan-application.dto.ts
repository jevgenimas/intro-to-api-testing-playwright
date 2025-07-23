export class LoanApplicationDto {
  income: number
  debt: number
  age: number
  employed: boolean
  loanAmount: number
  loanPeriod: number

  private constructor(
    income: number,
    debt: number,
    age: number,
    employed: boolean,
    loanAmount: number,
    loanPeriod: number,
  ) {
    this.income = income
    this.debt = debt
    this.age = age
    this.employed = employed
    this.loanAmount = loanAmount
    this.loanPeriod = loanPeriod
  }

  static negativeIncome(): LoanApplicationDto {
    return new LoanApplicationDto(0, 0, 30, true, 1000, 6)
  }

  static mediumRisk(): LoanApplicationDto {
    return new LoanApplicationDto(2000, 500, 25, true, 3000, 6)
  }

  static lowRisk(): LoanApplicationDto {
    return new LoanApplicationDto(5000, 0, 40, true, 1000, 12)
  }

  static highRisk(): LoanApplicationDto {
    return new LoanApplicationDto(1000, 900, 20, true, 5000, 3)
  }

  static negativeDebt(): LoanApplicationDto {
    return new LoanApplicationDto(2000, -1, 28, true, 1000, 6)
  }
}
