import { Alert as NativeAlert, AlertButton } from 'react-native';

const defaultButtons = (resolve: any, reject: any): AlertButton[] => [
  {
    text: 'OK',
    onPress: () => {
      resolve();
    },
  },
];

const AsyncAlert = (title: string, msg: string, getButtons = defaultButtons) =>
  new Promise((resolve, reject) => {
    NativeAlert.alert(title, msg, getButtons(resolve, reject), { cancelable: false });
  });

export default AsyncAlert;
