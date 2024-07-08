// frontend/src/hooks/useApi.js
import { useState, useEffect } from 'react';

const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => setError(error));
  }, [endpoint]);

  return { data, error };
};

export default useApi;