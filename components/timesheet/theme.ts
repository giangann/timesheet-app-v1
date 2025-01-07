import { DeepPartial, ThemeConfigs } from "@howljs/calendar-kit";

export const customeTheme: DeepPartial<ThemeConfigs> = {
  // Your custom theme properties here
  eventContainerStyle: {
    // borderRadius: 4,
    padding: 4,
  },
  eventTitleStyle: {
    // fontSize: 12,
    // fontWeight: "bold",
    color: "white",
    fontFamily: 'Nunito',
  },
};
