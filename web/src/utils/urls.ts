let apiUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3000';

if (apiUrl.endsWith('/')) {
  apiUrl = apiUrl.slice(0, -1);
}

export default {
  apiUrl,
};
