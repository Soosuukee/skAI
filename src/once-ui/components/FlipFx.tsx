"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  forwardRef,
} from "react";
import { Flex } from ".";

export interface FlipFxProps extends React.ComponentProps<typeof Flex> {
  flipDirection?: "horizontal" | "vertical";
  timing?: number;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  disableClickFlip?: boolean;
  autoFlipInterval?: number;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const FlipFx = forwardRef<HTMLDivElement, FlipFxProps>((props, ref) => {
  const {
    flipDirection = "horizontal",
    timing = 2000,
    flipped,
    onFlip,
    disableClickFlip = false,
    autoFlipInterval,
    front,
    back,
    className,
    style,
    ...flex
  } = props;

  const [internalFlipped, setInternalFlipped] = useState(false);
  const flippedState = flipped ?? internalFlipped;

  // Include `null` in the generic so that `useRef` returns a **mutable** ref object
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (cardRef.current && frontRef.current && backRef.current) {
        // Using `offsetHeight` instead of `scrollHeight` because elements that
        // rely on `aspect-ratio` often report a `scrollHeight` of 0 even when
        // they visibly occupy space. `offsetHeight` gives the rendered height.
        const frontH = frontRef.current.offsetHeight;
        const backH = backRef.current.offsetHeight;
        cardRef.current.style.height = `${Math.max(frontH, backH)}px`;
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (frontRef.current) observer.observe(frontRef.current);
    if (backRef.current) observer.observe(backRef.current);

    return () => observer.disconnect();
  }, [flippedState, front, back]);

  useEffect(() => {
    if (autoFlipInterval) {
      const interval = setInterval(() => {
        setInternalFlipped((prev) => !prev);
        onFlip?.(!flippedState);
      }, autoFlipInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoFlipInterval, flippedState, onFlip]);

  const handleFlip = useCallback(() => {
    if (disableClickFlip || autoFlipInterval) return;
    setInternalFlipped((v) => !v);
    onFlip?.(!flippedState);
  }, [disableClickFlip, autoFlipInterval, flippedState, onFlip]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleFlip();
      }
    },
    [handleFlip]
  );

  return (
    <Flex
      ref={(node) => {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node as HTMLDivElement;
        if (typeof ref === "function") ref(node as HTMLDivElement);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: `transform ${timing}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        transform: flippedState
          ? flipDirection === "vertical"
            ? "rotateX(180deg)"
            : "rotateY(180deg)"
          : "none",
        perspective: "1000px",
        ...style,
      }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      aria-pressed={flippedState}
      tabIndex={0}
      {...flex}
    >
      <Flex
        ref={frontRef}
        fill
        position="absolute"
        overflow="hidden"
        aria-hidden={flippedState}
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        {front}
      </Flex>

      <Flex
        ref={backRef}
        fill
        position="absolute"
        overflow="hidden"
        aria-hidden={!flippedState}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <Flex
          fill
          style={{
            transform:
              flipDirection === "vertical"
                ? "rotateY(-180deg) rotateX(180deg)"
                : undefined,
          }}
        >
          {back}
        </Flex>
      </Flex>
    </Flex>
  );
});

FlipFx.displayName = "FlipFx";
export { FlipFx };
