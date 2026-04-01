// src/components/MigrationButton.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function MigrationButton() {
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState('');

  const migrateData = async () => {
    setMigrating(true);
    setProgress('Starting migration...');

    try {
      // 1. Get localStorage data
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const localSubscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');

      setProgress(`Found ${localUsers.length} users, ${localSubscribers.length} subscribers, ${localPosts.length} posts`);

      // 2. Migrate Users to Profiles
      let migratedUsers = 0;
      for (const user of localUsers) {
        try {
          // Check if user already exists in Supabase by email
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', user.email)
            .maybeSingle();

          if (existing) {
            // Update existing profile
            await supabase
              .from('profiles')
              .update({
                name: user.name,
                phone: user.phone || '',
                ward: user.ward || '',
                role: user.role || 'subscriber',
                status: user.status || 'approved',
                created_at: user.createdAt || new Date().toISOString(),
              })
              .eq('id', existing.id);
          } else {
            // Create new auth user and profile
            const tempPassword = Math.random().toString(36).slice(-8);
            
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
              email: user.email,
              password: tempPassword,
              options: {
                data: {
                  name: user.name,
                  phone: user.phone || '',
                  ward: user.ward || '',
                  role: user.role || 'subscriber',
                }
              }
            });

            if (signUpError) {
              console.error(`Failed to create auth user for ${user.email}:`, signUpError);
              continue;
            }

            if (authData.user) {
              // Update profile with correct status
              await supabase
                .from('profiles')
                .update({
                  status: user.status || 'approved',
                  created_at: user.createdAt || new Date().toISOString(),
                })
                .eq('id', authData.user.id);
            }
          }
          migratedUsers++;
          setProgress(`Migrated ${migratedUsers}/${localUsers.length} users...`);
        } catch (err) {
          console.error(`Error migrating user ${user.email}:`, err);
        }
      }

      // 3. Migrate Subscribers
      let migratedSubs = 0;
      for (const sub of localSubscribers) {
        try {
          const { error } = await supabase
            .from('subscriptions')
            .upsert({ 
              email: sub.email,
              name: sub.name || '',
              phone: sub.phone || '',
              subscribed_at: sub.subscribedAt || new Date().toISOString(),
            }, { onConflict: 'email' });

          if (!error) migratedSubs++;
        } catch (err) {
          console.error(`Error migrating subscriber ${sub.email}:`, err);
        }
      }
      setProgress(`Migrated ${migratedSubs} subscribers...`);

      // 4. Migrate Posts (if you have them in localStorage)
      let migratedPosts = 0;
      for (const post of localPosts) {
        try {
          // Find author by email or name
          const { data: author } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', post.userEmail || post.userId)
            .maybeSingle();

          const { error } = await supabase
            .from('posts')
            .insert({
              title: post.title || 'Untitled',
              content: post.content,
              author_id: author?.id || null,
              status: post.status || 'published',
              created_at: post.createdAt || new Date().toISOString(),
              featured_image: post.mediaUrl || null,
            });

          if (!error) migratedPosts++;
        } catch (err) {
          console.error(`Error migrating post:`, err);
        }
      }

      // 5. Clear localStorage after successful migration
      localStorage.removeItem('users');
      localStorage.removeItem('subscribers');
      localStorage.removeItem('posts');
      localStorage.removeItem('pendingApprovals');

      toast.success(`Migration complete! Migrated ${migratedUsers} users, ${migratedSubs} subscribers, ${migratedPosts} posts`);
      setProgress('Migration complete! Refresh the page.');
      
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Migration failed. Check console for details.');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl m-4">
      <h3 className="font-bold text-lg mb-2 text-yellow-800">Data Migration Required</h3>
      <p className="text-yellow-700 mb-4">
        Your old localStorage data needs to be migrated to Supabase. 
        Click below to migrate all users, subscribers, and posts.
      </p>
      {progress && <p className="text-sm text-gray-600 mb-4">{progress}</p>}
      <button
        onClick={migrateData}
        disabled={migrating}
        className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 font-medium"
      >
        {migrating ? 'Migrating...' : 'Start Migration'}
      </button>
    </div>
  );
}