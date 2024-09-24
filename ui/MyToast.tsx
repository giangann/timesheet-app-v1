import Toast, { ToastOptions } from "react-native-root-toast";

export class MyToast {
  static success(message: string) {
    try {
      const successMessage = `✅ ${message}`;

      const toastOptions: ToastOptions = {
        backgroundColor: "green",
        duration: 2000,
        position: -100,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      };

      Toast.show(successMessage, toastOptions);
    } catch (error: any) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown Error");
      }
    }
  }

  static error(message: string) {
    try {
      const errorMessage = `⚠️ Lỗi: ${message}`;

      const toastOptions: ToastOptions = {
        backgroundColor: "red",
        duration: 3000,
        position: -100,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      };

      Toast.show(errorMessage, toastOptions);
    } catch (error: any) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown Error");
      }
    }
  }

  static notify(message: string, extraToastOpts?: ToastOptions) {
    try {
      const notiMessage = `🔔 ${message}`;

      const toastOptions: ToastOptions = {
        duration: 3000,
        position: -100,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        ...extraToastOpts,
      };

      Toast.show(notiMessage, toastOptions);
    } catch (error: any) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown Error");
      }
    }
  }
}
