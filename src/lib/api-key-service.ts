import crypto from 'crypto';
import { supabase } from './supabase';

// Generate a secure API key
export function generateApiKey(): string {
  return `risely_${crypto.randomBytes(32).toString('hex')}`;
}

// Hash API key for storage
export function hashApiKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex');
}

// Create a new API key
export async function createApiKey(userId: string, name: string) {
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name,
      key_hash: keyHash,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating API key:', error);
    throw error;
  }

  return {
    id: data.id,
    key: apiKey, // Only return once
    name: data.name,
    createdAt: data.created_at
  };
}

// Get user's API keys (without exposing the actual keys)
export async function getUserApiKeys(userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, is_active, last_used_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }

  return data || [];
}

// Verify API key
export async function verifyApiKey(apiKey: string): Promise<string | null> {
  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Update last used
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('key_hash', keyHash);

  return data.user_id;
}

// Revoke API key
export async function revokeApiKey(keyId: string) {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId);

  if (error) {
    console.error('Error revoking API key:', error);
    throw error;
  }
}

// Delete API key
export async function deleteApiKey(keyId: string) {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId);

  if (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
}
