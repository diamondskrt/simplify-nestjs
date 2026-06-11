interface ISupabaseJwtPayload {
  sub: string;
  email: string;
  role?: string;

  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
}

interface IAuthUser {
  id: string;
  email: string;
}

interface IRequestContext {
  req: {
    headers: {
      authorization: string;
    };
    user: IAuthUser;
  };
}

export type { IRequestContext, ISupabaseJwtPayload, IAuthUser };
