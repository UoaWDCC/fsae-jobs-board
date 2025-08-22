import { useState, useEffect, useMemo } from 'react';

export const usePagination = <T>(
  data: T[],
  defaultItemsPerPage: number,
  breakpoint: number = 1080,
  breakpointItemsPerPage?: number
) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );

  const updateItemsPerPage = () => {
    if (typeof window === 'undefined') return;

    setIsPortrait(window.innerHeight > window.innerWidth);

    if (window.innerWidth > breakpoint) {
      setItemsPerPage(breakpointItemsPerPage || defaultItemsPerPage);
    } else {
      setItemsPerPage(defaultItemsPerPage);
    }

    // Reset to page 1 when items per page changes
    setPage(1);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [breakpoint, breakpointItemsPerPage, defaultItemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, page, itemsPerPage]);

  const chunkedData = useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += itemsPerPage) {
      chunks.push(data.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [data, itemsPerPage]);

  return {
    activePage: page,
    setActivePage: setPage,
    itemsPerPage,
    isPortrait,
    paginatedData,
    chunkedData,
    totalPages,
  };
};