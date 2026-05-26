import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export interface FlyingItem {
  id: string;
  image?: string;
  startX: number;
  startY: number;
}

interface FlyingIngredientProps {
  item: FlyingItem;
  onComplete: (id: string) => void;
}

function findTarget(): { x: number; y: number } {
  // 1. Mobile composer bottom bar
  const bottomBar = document.getElementById('composer-bottom-bar');
  if (bottomBar) {
    const r = bottomBar.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  // 2. Desktop composer summary panel
  const summary = document.getElementById('composer-summary');
  if (summary) {
    const r = summary.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + 60 };
  }
  // 3. Header cart icon (global pages: juices, meals, etc.)
  const cartIcon = document.getElementById('cart-header-icon');
  if (cartIcon) {
    const r = cartIcon.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  // Fallback: top-right corner
  return { x: window.innerWidth - 72, y: 28 };
}

export function FlyingIngredient({ item, onComplete }: FlyingIngredientProps) {
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Small delay so layout has settled
    const id = requestAnimationFrame(() => setTargetPos(findTarget()));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!targetPos) return null;

  const deltaX = targetPos.x - item.startX;
  const deltaY = targetPos.y - item.startY;

  // Parabolic arc: midpoint arches upward by arcHeight
  const arcHeight = Math.max(70, Math.abs(deltaX) * 0.22);
  const arcMidX = deltaX * 0.5;
  const arcMidY = deltaY * 0.5 - arcHeight;

  return createPortal(
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: item.startX, top: item.startY }}
      initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
      animate={{
        x: [0, arcMidX, deltaX],
        y: [0, arcMidY, deltaY],
        scale: [1, 1.18, 0.12],
        opacity: [1, 1, 0],
        rotate: [0, -18, 8],
      }}
      transition={{
        duration: 0.72,
        times: [0, 0.42, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => onComplete(item.id)}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-primary bg-background flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <ShoppingCart className="w-5 h-5 text-primary" />
        )}
      </div>
    </motion.div>,
    document.body,
  );
}
