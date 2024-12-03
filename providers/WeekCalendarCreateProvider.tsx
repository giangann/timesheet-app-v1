import { TWeekCalendarCreateFormFields } from "@/types";
import { createContext, useContext } from "react";
import { UseFieldArrayReturn, UseFormReturn, useFieldArray, useForm } from "react-hook-form";

// TYPES
type TWeekCalendarCreateContext = {
  useFormReturn: UseFormReturn<TWeekCalendarCreateFormFields>|null;
  useFieldArrayReturn: UseFieldArrayReturn<TWeekCalendarCreateFormFields, "users">|null;
};


// CONTEXT
const WeekCalendarCreateContext = createContext<TWeekCalendarCreateContext>({
  useFormReturn: null,
  useFieldArrayReturn: null,
});

// HOOKS
export const useWeekCalendarCreateProvider = () => useContext(WeekCalendarCreateContext);

// PROVIDERS
type ProviderProps = { children: React.ReactNode };
export const WeekCalendarCreateProvider: React.FC<ProviderProps> = ({ children }) => {
  const useFormReturn = useForm<TWeekCalendarCreateFormFields>();
  const { control } = useFormReturn;

  const useFieldArrayReturn = useFieldArray({ name: "users", control: control });

  return <WeekCalendarCreateContext.Provider value={{ useFormReturn, useFieldArrayReturn }}>{children}</WeekCalendarCreateContext.Provider>;
};
