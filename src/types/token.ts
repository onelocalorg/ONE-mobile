export enum TokenType {
  fcm = "fcm",
}

export interface Token {
  token: string;
  type: TokenType;
  deviceId?: string;
}

export interface RegisterTokenData extends Token {
  userId: string;
}
