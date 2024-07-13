export interface ITokenManager<T extends object> {
  generate: (payload: T, expiry: string) => string;
  verify: (token: string) => T;
}
