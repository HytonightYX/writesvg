import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 禁止聚焦后 refecth
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

export { queryClient };
