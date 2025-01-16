export interface AddAccountBody {
  firstName: string;
  lastName: string;
}

export interface AddAccountResponse {
  accountId: string;
  name: string;
}

export interface ChangeBalanceBody {
  accountId: string;
  amount: number;
}

export interface ChangeBalanceResponse {
  accountId: string;
  amount: number;
}

export interface GetAccountResponse {
  accountId: string;
  name: string;
  balance: number;
}
