import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  emoji?: string;
  likes: number;
  createdAt: string;
}

interface PostsContextType {
  posts: Post[];
  addPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', emoji?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  isLoading: boolean;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch posts from Supabase
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
        return;
      }

      const formattedPosts: Post[] = (data || []).map((post: any) => ({
        id: post.id,
        userId: post.user_id,
        userName: post.user_name,
        content: post.content,
        mediaUrl: post.media_url,
        mediaType: post.media_type,
        emoji: post.emoji,
        likes: post.likes || 0,
        createdAt: post.created_at,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Exception fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Add post to Supabase
  const addPost = async (
    content: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'video',
    emoji?: string
  ) => {
    if (!user) throw new Error('Must be logged in to post');

    try {
      let uploadedMediaUrl = mediaUrl;
      
      // Upload media if provided as base64
      if (mediaUrl && mediaUrl.startsWith('data:')) {
        const file = dataURLtoFile(mediaUrl, `post-${Date.now()}`);
        const fileExt = mediaType === 'video' ? 'mp4' : 'png';
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError.message);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        
        uploadedMediaUrl = publicUrl;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          user_name: user.name,
          content: content,
          media_url: uploadedMediaUrl,
          media_type: mediaType,
          emoji: emoji,
          likes: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding post:', error.message);
        throw error;
      }

      const newPost: Post = {
        id: data.id,
        userId: data.user_id,
        userName: data.user_name,
        content: data.content,
        mediaUrl: data.media_url,
        mediaType: data.media_type,
        emoji: data.emoji,
        likes: data.likes,
        createdAt: data.created_at,
      };

      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Exception adding post:', error);
      throw error;
    }
  };

  // Delete post from Supabase
  const deletePost = async (postId: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Security: only delete own posts

      if (error) {
        console.error('Error deleting post:', error.message);
        throw error;
      }

      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Exception deleting post:', error);
      throw error;
    }
  };

  // Like post in Supabase
  const likePost = async (postId: string) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));

      const { error } = await supabase.rpc('increment_likes', { post_id: postId });
      
      if (error) {
        // Revert on error
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, likes: p.likes - 1 } : p
        ));
        throw error;
      }
    } catch (error) {
      console.error('Exception liking post:', error);
      throw error;
    }
  };

  // Helper to convert data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost, likePost, isLoading }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}