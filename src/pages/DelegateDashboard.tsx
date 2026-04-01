import { useState, useRef } from 'react';
import { 
  Image, 
  Video, 
  Smile, 
  Send, 
  LogOut, 
  User, 
  MapPin,
  Heart,
  MessageCircle,
  Share2,
  X,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostsContext';
import { toast } from 'sonner';

const EMOJIS = ['🔥', '💛', '💚', '👏', '❤️', '🎉', '✊', '💪', '🌟', '🙏', '🇰🇪', '🗳️'];

export default function DelegateDashboard() {
  const { user, logout } = useAuth();
  const { posts, addPost, deletePost, likePost, isLoading } = usePosts();
  const [content, setContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaPreview) {
      toast.error('Please write something or add media');
      return;
    }

    setIsSubmitting(true);

    try {
      await addPost(content, mediaPreview || undefined, mediaType || undefined, selectedEmoji || undefined);
      
      toast.success('Post published successfully!');
      setContent('');
      setSelectedEmoji('');
      setMediaPreview(null);
      setMediaType(null);
    } catch (error) {
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(postId);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      // Silent fail - UI will update optimistically
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
        setMediaType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const myPosts = posts.filter(p => p.userId === user?.id);
  const myLikes = myPosts.reduce((acc, p) => acc + p.likes, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo.jpg" 
                alt="UDA Logo" 
                className="h-10 w-auto rounded"
              />
              <div>
                <h1 className="font-bold text-lg">Delegate Dashboard</h1>
                <p className="text-xs text-gray-500">Aisha Jumwa Campaign 2027</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#f9d100] flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-black" />
                </div>
                <h2 className="font-bold text-xl">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-[#008000]/10 text-[#008000] text-xs font-medium rounded-full">
                  Approved Delegate
                </span>
              </div>
              
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user?.ward || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{user?.phone || 'Not specified'}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold text-sm mb-3">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#f9d100]">{myPosts.length}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#008000]">{myLikes}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Post Creation & Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">Share an Update</h3>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening in your area? Share updates, photos, or videos..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#f9d100] focus:ring-2 focus:ring-[#f9d100]/20 outline-none transition-all resize-none"
                  rows={4}
                  disabled={isSubmitting}
                />

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="relative mt-4 rounded-lg overflow-hidden">
                    {mediaType === 'image' ? (
                      <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover" />
                    ) : (
                      <video src={mediaPreview} controls className="w-full max-h-64" />
                    )}
                    <button
                      type="button"
                      onClick={clearMedia}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Selected Emoji */}
                {selectedEmoji && (
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-2xl">{selectedEmoji}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedEmoji('')}
                      className="text-gray-400 hover:text-red-500"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Select an emoji:</p>
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setSelectedEmoji(emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-2xl p-2 hover:bg-gray-200 rounded transition-colors"
                          disabled={isSubmitting}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'image')}
                      className="hidden"
                      id="image-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Image className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">Image</span>
                    </label>

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileSelect(e, 'video')}
                      className="hidden"
                      id="video-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="video-upload"
                      className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Video className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">Video</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      <Smile className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">Emoji</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (!content.trim() && !mediaPreview)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#f9d100] text-black font-semibold rounded-lg hover:bg-[#e5c000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Community Updates</h3>
                <span className="text-sm text-gray-500">{posts.length} posts</span>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9d100] mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500">No posts yet. Be the first to share!</p>
                </div>
              ) : (
                posts.map((post) => {
                  const isMyPost = post.userId === user?.id;
                  
                  return (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#f9d100] flex items-center justify-center">
                          <User className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{post.userName}</p>
                          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                        {post.emoji && (
                          <span className="text-2xl">{post.emoji}</span>
                        )}
                        {isMyPost && (
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Post Content */}
                      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                      {/* Post Media */}
                      {post.mediaUrl && (
                        <div className="rounded-lg overflow-hidden mb-4">
                          {post.mediaType === 'video' ? (
                            <video src={post.mediaUrl} controls className="w-full max-h-96" />
                          ) : (
                            <img src={post.mediaUrl} alt="Post media" className="w-full max-h-96 object-cover" />
                          )}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pt-4 border-t">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">Comment</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}