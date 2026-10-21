import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { instructorService } from '../api/instructorService';
import type { Instructor } from '../models/Instructor';

export function useCurrentInstructor() {
  const { user } = useAuth();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const userEmail = user?.email;

  const refetch = useCallback(() => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchInstructor = async () => {
      try {
        if (!userEmail) {
          if (!cancelled) {
            setInstructor(null);
          }
          return;
        }

        setError(null);
        const instructors = await instructorService.getAll();
        if (cancelled) return;

        const current = instructors.find(
          (i) => i.email.toLowerCase() === userEmail.toLowerCase()
        );

        setInstructor(current || null);
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : 'Error al cargar datos del instructor';
        setError(msg);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchInstructor();

    return () => {
      cancelled = true;
    };
  }, [userEmail, reloadKey]);

  return {
    instructor,
    loading,
    error,
    refetch,
  };
}

export default useCurrentInstructor;

