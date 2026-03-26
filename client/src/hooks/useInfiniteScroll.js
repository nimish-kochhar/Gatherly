// TODO: Implement useInfiniteScroll (intersection observer)
import { useRef, useCallback } from 'react';

export default function useInfiniteScroll(callback) {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) callback();
      });
      if (node) observer.current.observe(node);
    },
    [callback]
  );

  return { lastElementRef };
}
