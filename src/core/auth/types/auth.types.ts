import { TypedSupabaseClient } from '~/core/supabase';

interface ISupabaseJwtPayload {
  sub: string;
  email: string;
  role?: string;

  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;

  [key: string]: unknown;
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
    supabase: TypedSupabaseClient;
  };
}

type ICurrentContext = Omit<IRequestContext['req'], 'headers'>;

export type {
  IRequestContext,
  ICurrentContext,
  ISupabaseJwtPayload,
  IAuthUser,
};
