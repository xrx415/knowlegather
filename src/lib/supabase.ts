import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchCollections(userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching collections:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function fetchCollectionById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching collection:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function fetchResourcesByCollectionId(collectionId: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching resources:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function fetchResourceById(id: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching resource:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createCollection(collectionData: any, userId: string) {
  const { data, error } = await supabase
    .from('collections')
    .insert([
      { ...collectionData, user_id: userId }
    ])
    .select();
    
  if (error) {
    console.error('Error creating collection:', error);
    throw new Error(error.message);
  }
  
  return data[0];
}

export async function updateCollection(id: string, collectionData: any) {
  const { data, error } = await supabase
    .from('collections')
    .update(collectionData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating collection:', error);
    throw new Error(error.message);
  }
  
  return data[0];
}

export async function deleteCollection(id: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting collection:', error);
    throw new Error(error.message);
  }
  
  return true;
}

export async function createResource(resourceData: any) {
  const { data, error } = await supabase
    .from('resources')
    .insert([resourceData])
    .select();
    
  if (error) {
    console.error('Error creating resource:', error);
    throw new Error(error.message);
  }
  
  return data[0];
}

export async function updateResource(id: string, resourceData: any) {
  const { data, error } = await supabase
    .from('resources')
    .update(resourceData)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating resource:', error);
    throw new Error(error.message);
  }
  
  return data[0];
}

export async function deleteResource(id: string) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting resource:', error);
    throw new Error(error.message);
  }
  
  return true;
}