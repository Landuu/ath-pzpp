import Notify from 'devextreme/ui/notify';
import { ToastType } from 'devextreme/ui/toast';

export const useToast = () => {
    const showToast = (msg: string, type: ToastType = "info") => {
        const toastOption: any = {
            message: msg,
            height: 'auto',
            width: 'auto',
            minWidth: 300,
            type: type,
            displayTime: 2500,
            animation: {
                show: { type: 'fade', duration: 150, from: 0, to: 1 },
                hide: { type: 'fade', duration: 150, from: 1, to: 0 },
            }
        };
        Notify(toastOption, {
            position: 'bottom center',
            direction: 'up-push'
        });
    }

    return showToast;
}
