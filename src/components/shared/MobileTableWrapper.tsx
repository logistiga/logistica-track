import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileTableWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper pour tables existantes qui ajoute un scroll horizontal intelligent
 * avec indicateurs de pagination sur mobile
 */
export function MobileTableWrapper({ children, className }: MobileTableWrapperProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollPosition(target.scrollLeft);
    setMaxScroll(target.scrollWidth - target.clientWidth);
  };

  const scrollLeft = () => {
    const container = document.getElementById('mobile-table-scroll');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('mobile-table-scroll');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const showLeftButton = scrollPosition > 10;
  const showRightButton = scrollPosition < maxScroll - 10;

  return (
    <div className="relative">
      {/* Boutons de navigation mobile */}
      <div className="md:hidden">
        {showLeftButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 shadow-lg bg-background/95 backdrop-blur"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {showRightButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 shadow-lg bg-background/95 backdrop-blur"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Container avec scroll horizontal */}
      <div
        id="mobile-table-scroll"
        onScroll={handleScroll}
        className={cn(
          "overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted",
          className
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Gradient indicators pour le scroll */}
        {showLeftButton && (
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
        )}
        {showRightButton && (
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
        )}
        
        <div className="min-w-max">
          {children}
        </div>
      </div>

      {/* Indicateur de scroll mobile */}
      {maxScroll > 0 && (
        <div className="md:hidden mt-2 flex justify-center gap-1">
          {[...Array(Math.ceil(maxScroll / 300) + 1)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                Math.floor(scrollPosition / 300) === i
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
