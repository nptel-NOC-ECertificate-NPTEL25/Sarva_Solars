import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types';

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Authentication succeeded but no user was returned.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, email, role, phone, created_at')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    throw profileError;
  }

  if (!data.session?.access_token) {
    await supabase.auth.signOut();
    throw new Error('Authentication succeeded but no session token was returned.');
  }

  return {
    token: data.session.access_token,
    user: {
      id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    phone: profile.phone ?? undefined,
      createdAt: profile.created_at,
    },
  };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSupabaseUser(): Promise<User | null> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, phone, created_at')
    .eq('id', authUser.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    phone: profile.phone ?? undefined,
    createdAt: profile.created_at,
  };
}
