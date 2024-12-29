import { SkeletonRectangleLoader } from "@/ui/skeletons/SkeletonRectangleLoader";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  waitBeforeShow?: number; // milliseconds
};

export const Delayed: React.FC<Props> = ({ children, waitBeforeShow = 500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : <SkeletonRectangleLoader />;
};
