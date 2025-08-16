import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to redirect users to profile completion page if their profile is incomplete.
 * Uses localStorage flag set during login to determine if profile needs completion.
 */
export function useProfileCompletionGuard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasIncompleteProfile = localStorage.getItem('profileIncomplete') === 'true';
    if (hasIncompleteProfile) {
      navigate('/complete-profile', { replace: true });
    }
  }, [navigate]);
}