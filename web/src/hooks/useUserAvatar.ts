import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/api/ApiInstance';

export const useUserAvatar = (publisherId: string | undefined) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const fetchAvatar = async (userId: string) => {
    if (!userId) {
      return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      
      // Try sponsor endpoint first
      let response = await fetch(`${API_BASE_URL}/user/sponsor/${userId}/avatar`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // If sponsor avatar not found, try alumni endpoint
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/user/alumni/${userId}/avatar`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      }

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      } else {
        setAvatarUrl('');
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
      setAvatarUrl('');
    }
  };

  // Fetch avatar when publisherId changes
  useEffect(() => {
    if (publisherId) {
      fetchAvatar(publisherId);
    }
  }, [publisherId]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  return { avatarUrl, refetch: () => publisherId && fetchAvatar(publisherId) };
};