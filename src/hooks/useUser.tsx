import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

import UserInfo from 'interfaces/UserInfo';

interface Params {
  redirectTo?: boolean | string;
  redirectIfFound?: boolean;
}
export default function useUser({ redirectTo = false, redirectIfFound = false }: Params = {}) {
  const { data: user, error, mutate: mutateUser } = useSWR<{ isLoggedIn: boolean; info?: UserInfo }>('/api/profile');

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      if (typeof redirectTo == 'string') {
        Router.push(redirectTo);
      }
    }
  }, [user, redirectIfFound, redirectTo]);
  return { user, loading: !user && !error, error, mutateUser };
}
