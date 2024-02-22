import { useQuery } from '@tanstack/react-query';
import QueryKeys from '@utils/queryKeys';
import axios from 'axios';
import { useParams } from 'react-router';
import urls from '@utils/urls';

export default function Home() {
  const { name } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [QueryKeys.GetIntro, name],
    queryFn: async () => {
      const { data } = await axios(`/hello/${name}`, {
        method: 'get',
        baseURL: urls.apiUrl,
      });
      return data;
    },
  });

  if (isLoading) {
    return <div className="loading loading-spinner" />;
  }
  if (isError) {
    return <div>Error: {error.name}</div>;
  }
  return <div>{data}</div>;
}
