import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  business_name?: string;
  email?: string;
  currency?: string;
  country?: string;
  phone?: string;
  company_size?: string;
  industry?: string;
  tax_id?: string;
  timezone?: string;
  language?: string;
  theme?: string;
  profile_image_url?: string;
  subscription_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }

  return data || null;
}

// Create or update user profile
export async function upsertProfile(userId: string, profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

// Update profile image
export async function updateProfileImage(userId: string, imageUrl: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      profile_image_url: imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile image:', error);
    throw error;
  }

  return data;
}

// Update user preferences
export async function updatePreferences(
  userId: string,
  preferences: {
    timezone?: string;
    language?: string;
    theme?: string;
    currency?: string;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...preferences,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }

  return data;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user by email:', error);
  }

  return data || null;
}

// Update business information
export async function updateBusinessInfo(
  userId: string,
  businessInfo: {
    business_name?: string;
    phone?: string;
    country?: string;
    company_size?: string;
    industry?: string;
    tax_id?: string;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...businessInfo,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating business info:', error);
    throw error;
  }

  return data;
}

// Delete profile
export async function deleteProfile(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}

// Search profiles by business name
export async function searchProfilesByBusiness(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, business_name, profile_image_url')
    .ilike('business_name', `%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching profiles:', error);
    return [];
  }

  return data || [];
}
