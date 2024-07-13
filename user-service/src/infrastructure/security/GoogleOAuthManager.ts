import axios from "axios";
import querystring from "querystring";
import {
  IGoogleOAuthManger,
  IGoogleTokensResult,
} from "../../application/interfaces/IGoogleOAuthManager";

export class GoogleOAuthManager implements IGoogleOAuthManger {
  async getGoogleToken(code: string) {
    const URL = "https://oauth2.googleapis.com/token";

    const values = {
      code,
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URL!,
      grant_type: "authorization_code",
    };

    const qs = querystring.stringify(values);

    try {
      const res = await axios.post<IGoogleTokensResult>(
        `${URL}?${qs.toString()}`,
        {},
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      return res.data;
    } catch (err) {
      throw new Error("Failed to fetch google tokens");
    }
  }
}
