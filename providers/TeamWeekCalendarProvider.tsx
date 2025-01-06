import { createContext, useCallback, useContext, useState } from "react";

export type TSearchParams = { viewMode: string; numberOfDays: string };
export const defaultSearchParams: TSearchParams = {
  viewMode: "week",
  numberOfDays: "7",
};

export type TTeamWeekCalendarContext = {
  searchParams: TSearchParams;
  onUpdateSearchParams: (newPartialParams: Partial<TSearchParams>) => void;
};

export const TeamWeekCalendarContext = createContext<TTeamWeekCalendarContext>({
  searchParams: defaultSearchParams,
  onUpdateSearchParams(_newPartialParams) { },
});

export const useTeamWeekCalendarProvider = () => useContext(TeamWeekCalendarContext);

type ProviderProps = { children: React.ReactNode };
export const TeamWeekCalendarProvider = ({ children }: ProviderProps) => {
  const [searchParams, setSearchParams] = useState<TSearchParams>(defaultSearchParams);

  const onUpdateSearchParams = useCallback(
    (newPartialParams: Partial<TSearchParams>) => {
      setSearchParams((prev) => ({ ...prev, ...newPartialParams }));
    },
    [setSearchParams]
  );

  return (
    <TeamWeekCalendarContext.Provider value={{ searchParams, onUpdateSearchParams }}>{children}</TeamWeekCalendarContext.Provider>
  );
};
