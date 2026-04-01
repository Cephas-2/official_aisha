import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Mail, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Eye,
  Trash2,
  BarChart3,
  Bell,
  AlertTriangle,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { User, Subscriber } from '@/types';
import { toast } from 'sonner';

// Post type matching your Supabase schema
interface Post {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  emoji?: string;
  likes: number;
  created_at: string;
  // Joined data
  author?: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const { logout, approveUser, rejectUser, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'delegates' | 'subscribers' | 'posts'>('overview');
  const [pendingDelegates, setPendingDelegates] = useState<User[]>([]);
  const [approvedDelegates, setApprovedDelegates] = useState<User[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allProfiles, setAllProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    setLoading(true);
    
    try {
      // 1. Fetch all profiles (users)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load users');
      } else {
        const users = profiles || [];
        setAllProfiles(users);
        
        // Filter delegates
        const pending = users.filter(u => u.role === 'delegate' && u.status === 'pending');
        const approved = users.filter(u => u.role === 'delegate' && u.status === 'approved');
        setPendingDelegates(pending);
        setApprovedDelegates(approved);
      }

      // 2. Fetch subscribers
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subsError) {
        console.error('Error fetching subscribers:', subsError);
      } else {
        setSubscribers(subs || []);
      }

      // 3. Fetch posts with author info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(name, email)
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching posts:', postsError);
        toast.error('Failed to load posts');
      } else {
        // Format posts with author info
        const formattedPosts: Post[] = (postsData || []).map((post: any) => ({
          ...post,
          author: post.profiles ? {
            name: post.profiles.name || post.user_name,
            email: post.profiles.email
          } : {
            name: post.user_name,
            email: 'Unknown'
          }
        }));
        setPosts(formattedPosts);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      await fetchAllData();
      toast.success('Delegate approved successfully!');
    } catch (error: any) {
      toast.error(`Failed to approve: ${error.message}`);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectUser(userId);
      await fetchAllData();
      toast.success('Delegate application rejected.');
    } catch (error: any) {
      toast.error(`Failed to reject: ${error.message}`);
    }
  };

  const confirmDelete = (type: 'user' | 'subscriber' | 'post', id: string, name: string) => {
    setDeleteConfirm({ type, id, name });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;

    try {
      switch (deleteConfirm.type) {
        case 'user':
          await supabase.from('profiles').delete().eq('id', deleteConfirm.id);
          await fetchAllData();
          toast.success('User deleted successfully');
          break;
        case 'subscriber':
          await supabase.from('subscriptions').delete().eq('id', deleteConfirm.id);
          await fetchAllData();
          toast.success('Subscriber deleted successfully');
          break;
        case 'post':
          await supabase.from('posts').delete().eq('id', deleteConfirm.id);
          await fetchAllData();
          toast.success('Post deleted successfully');
          break;
      }
    } catch (error: any) {
      toast.error(`Failed to delete: ${error.message}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const exportToCSV = () => {
    const csv = subscribers.map(s => 
      `${s.name || 'N/A'},${s.email},${s.phone || 'N/A'},${s.subscribed_at}`
    ).join('\n');
    const blob = new Blob([`Name,Email,Phone,Subscribed At\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = [
    { 
      title: 'Total Subscribers', 
      value: subscribers.length, 
      icon: Mail, 
      color: 'bg-blue-500',
      change: '+12%'
    },
    { 
      title: 'Approved Delegates', 
      value: approvedDelegates.length, 
      icon: UserCheck, 
      color: 'bg-green-500',
      change: '+5%'
    },
    { 
      title: 'Pending Approvals', 
      value: pendingDelegates.length, 
      icon: Users, 
      color: 'bg-yellow-500',
      change: pendingDelegates.length > 0 ? 'New' : '0'
    },
    { 
      title: 'Total Posts', 
      value: posts.length, 
      icon: TrendingUp, 
      color: 'bg-purple-500',
      change: '+8%'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9d100] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo.jpg" 
                alt="UDA Logo" 
                className="h-10 w-auto rounded"
              />
              <div>
                <h1 className="font-bold text-lg">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">Aisha Jumwa Campaign 2027</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {pendingDelegates.length > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-[#f9d100]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {pendingDelegates.length}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-300 hidden sm:block">
                {user?.email}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen hidden lg:block">
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'delegates', label: 'Delegates', icon: Users },
              { id: 'subscribers', label: 'Subscribers', icon: Mail },
              { id: 'posts', label: 'Posts', icon: TrendingUp },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#f9d100] text-black font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === 'delegates' && pendingDelegates.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingDelegates.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40">
          <div className="flex justify-around p-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'delegates', label: 'Delegates', icon: Users },
              { id: 'subscribers', label: 'Subscribers', icon: Mail },
              { id: 'posts', label: 'Posts', icon: TrendingUp },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  activeTab === item.id ? 'text-[#f9d100]' : 'text-gray-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                      </div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals Alert */}
              {pendingDelegates.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-yellow-600" />
                    <h3 className="font-bold text-lg text-yellow-800">
                      Pending Approvals ({pendingDelegates.length})
                    </h3>
                  </div>
                  <p className="text-yellow-700 mb-4">
                    You have {pendingDelegates.length} delegate application{pendingDelegates.length > 1 ? 's' : ''} waiting for approval.
                  </p>
                  <button
                    onClick={() => setActiveTab('delegates')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Review Applications
                  </button>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-[#f9d100] flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.author?.name || post.user_name}</p>
                        <p className="text-sm text-gray-500 truncate">{post.content}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent posts</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DELEGATES TAB */}
          {activeTab === 'delegates' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Delegate Management</h2>
                
                {/* Pending Approvals */}
                {pendingDelegates.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-700">
                      <Bell className="w-5 h-5" />
                      Pending Approvals ({pendingDelegates.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingDelegates.map((delegate) => (
                        <div key={delegate.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{delegate.name}</p>
                            <p className="text-sm text-gray-500">{delegate.email} • {delegate.ward || 'No ward'}</p>
                            <p className="text-xs text-gray-400">Applied: {formatDate(delegate.created_at)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(delegate.id)}
                              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(delegate.id)}
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Delegates */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-lg mb-4">
                    Approved Delegates ({approvedDelegates.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Ward</th>
                          <th className="text-left py-3 px-4">Joined</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedDelegates.map((delegate) => (
                          <tr key={delegate.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{delegate.name}</td>
                            <td className="py-3 px-4 text-sm">{delegate.email}</td>
                            <td className="py-3 px-4 text-sm">{delegate.ward || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm">{formatDate(delegate.created_at)}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => confirmDelete('user', delegate.id, delegate.name)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete delegate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {approvedDelegates.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              No approved delegates yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIBERS TAB */}
          {activeTab === 'subscribers' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Newsletter Subscribers</h2>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                      Total Subscribers: <span className="font-bold text-black">{subscribers.length}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-[#f9d100] text-black rounded-lg hover:bg-[#e5c000] transition-colors"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Phone</th>
                          <th className="text-left py-3 px-4">Subscribed</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{subscriber.name || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm">{subscriber.email}</td>
                            <td className="py-3 px-4 text-sm">{subscriber.phone || 'N/A'}</td>
                            <td className="py-3 px-4 text-sm">{formatDate(subscriber.subscribed_at)}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => confirmDelete('subscriber', subscriber.id, subscriber.email)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete subscriber"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {subscribers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              No subscribers yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">All Posts ({posts.length})</h2>
                
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#f9d100] flex items-center justify-center">
                            <Users className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <p className="font-semibold">{post.author?.name || post.user_name}</p>
                            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                          </div>
                          {post.emoji && <span className="text-2xl">{post.emoji}</span>}
                        </div>
                        <button
                          onClick={() => confirmDelete('post', post.id, post.content.substring(0, 50) + '...')}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                      
                      {post.media_url && (
                        <div className="rounded-lg overflow-hidden mb-4">
                          {post.media_type === 'video' ? (
                            <video src={post.media_url} controls className="w-full max-h-96" />
                          ) : (
                            <img src={post.media_url} alt="Post media" className="w-full max-h-96 object-cover" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 pt-4 border-t">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Heart className="w-5 h-5 text-red-500" />
                          {post.likes} likes
                        </span>
                        <span className="flex items-center gap-2 text-gray-500">
                          <MessageCircle className="w-5 h-5" />
                          Comments
                        </span>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-gray-500">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}