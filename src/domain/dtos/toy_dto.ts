export interface AddToyResponse {
  toyId: string;
  name: string;
}

export interface AddToyBody {
  name: string;
  accountId: string;
  price: number;
}

export interface GetToyResponse {
  toyId: string;
  name: string;
  price: number;
}
