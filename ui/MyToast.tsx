import Toast, { ToastOptions } from "react-native-root-toast";

export class MyToast {
  static success(message: string) {
    const successMessage = `✅ ${message}`;

    const toastOptions: ToastOptions = {
      backgroundColor: "green",
      duration: 1000,
      position: -100,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    };

    Toast.show(successMessage, toastOptions);
  }

  static error(message: string) {
    const errorMessage = `⚠️ Lỗi: ${message}`;

    const toastOptions: ToastOptions = {
      backgroundColor: "red",
      duration: 2500,
      position: -100,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    };

    Toast.show(errorMessage, toastOptions);
  }
}
