export interface User {
  id: number | string;
  name: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export interface Asset {
  id: number;
  symbol: string;
  name: string;
  instrument_type: string;
  isin: string;
  exchange: string;
  currency: string;
  external_platform_id: string;
  created_at: string;
}

export interface CreateAssetRequest {
  symbol: string;
  name: string;
  instrument_type: string;
  isin: string;
  exchange: string;
  currency: string;
  external_platform_id: string;
}

export type UpdateAssetRequest = Partial<CreateAssetRequest>;

export interface AssetResponse {
  asset: Asset;
}
