import { Injectable } from '@nestjs/common';

import { UpdateUser } from './types';
import type { ICurrentContext } from '~/core/auth';

@Injectable()
export class UsersService {
  constructor() {}

  async getUsers(ctx: ICurrentContext) {
    const { data, error } = await ctx.supabase.from('users').select('*');
    if (error) throw error;

    return data;
  }

  async getUserById(ctx: ICurrentContext, id: string) {
    const { data, error } = await ctx.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  // async createUser(ctx: ICurrentContext, createUserDto: any) {
  //   const { data, error } = await ctx.supabase
  //     .from('users')
  //     .insert(createUserDto)
  //     .select()
  //     .single();

  //   if (error) throw error;

  //   return data;
  // }

  async updateUser(
    ctx: ICurrentContext,
    id: string,
    updateUserDto: UpdateUser,
  ) {
    const { data, error } = await ctx.supabase
      .from('users')
      .update(updateUserDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async deleteUser(ctx: ICurrentContext, id: string) {
    const { error } = await ctx.supabase.from('users').delete().eq('id', id);

    if (error) throw error;
  }
}
