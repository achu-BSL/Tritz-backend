export interface IGoogleTokensResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }

export interface IGoogleOAuthManger {
    getGoogleToken: (code: string) => Promise<IGoogleTokensResult>;
}