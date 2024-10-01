import SimpleSkeletonLoader from "@/ui/skeletons/SimpleSkeletonLoader";
import React, { useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
  waitBeforeShow?: number;
};

export const Delayed: React.FC<Props> = ({ children, waitBeforeShow = 500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? <>{children}</> : <SimpleSkeletonLoader />;
};
