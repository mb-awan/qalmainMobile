import {
  createNavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  VerifyEmail: undefined;
  TwoFactorLogin: { twoFactorToken: string; emailHint?: string };
  MainTabs: undefined;
  AccountSecurity: undefined;
  ChangePassword: undefined;
  TwoFactorSecurity: undefined;
  Quran: undefined;
  ParaList: undefined;
  Azan: undefined;
  Qibla: undefined;
  AIQari: undefined;
  IslamicLessons: undefined;
  Calendar: undefined;
  Subscription: undefined;
  Feedback: undefined;
};

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

export function resetToSignIn(): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      })
    );
  }
}

export function resetToVerifyEmail(): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'VerifyEmail' }],
      })
    );
  }
}

export function resetToMain(): void {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  }
}
