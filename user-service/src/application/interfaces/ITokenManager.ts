export interface ITokenManager<T extends object> {
  generate: (payload: T, expiry: string) => string;
  decode: (token: string) => T;
}
