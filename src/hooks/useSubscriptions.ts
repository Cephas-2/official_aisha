import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Subscriber } from '@/types';

export function useSubscriptions() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching subscribers:', error);
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  }, []);

  const deleteSubscriber = async (id: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSubscribers();
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

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return {
    subscribers,
    loading,
    fetchSubscribers,
    deleteSubscriber,
    exportToCSV,
  };
}