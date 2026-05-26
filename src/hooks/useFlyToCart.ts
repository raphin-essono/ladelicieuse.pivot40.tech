import { useState, useCallback } from 'react';
import type { FlyingItem } from '@/components/FlyingIngredient';

export function useFlyToCart() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const launchFly = useCallback(
    (e: React.MouseEvent, options: { image?: string } = {}) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyingItems(prev => [
        ...prev,
        {
          id: `fly-${Date.now()}-${Math.random()}`,
          image: options.image,
          startX: rect.left + rect.width / 2 - 24,
          startY: rect.top + rect.height / 2 - 24,
        },
      ]);
    },
    [],
  );

  const removeFlyingItem = useCallback((id: string) => {
    setFlyingItems(prev => prev.filter(f => f.id !== id));
  }, []);

  return { flyingItems, launchFly, removeFlyingItem };
}
