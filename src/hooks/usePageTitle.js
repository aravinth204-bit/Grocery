import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | FreshCart` : 'FreshCart – Premium Organic Grocery';
    return () => { document.title = prevTitle; };
  }, [title]);
};

export default usePageTitle;
