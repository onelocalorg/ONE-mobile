import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import {
  AuthMutations,
  ResetPasswordProps,
  VerifyOtpProps,
} from "~/network/api/services/useAuthService";
import { ForgotPassword } from "~/types/forgot-password";
import { createStyleSheet } from "./style";

interface ForgotPasswordScreenProps {
  onDismiss?: () => void;
}
export const ForgotPasswordScreen = ({
  onDismiss,
}: ForgotPasswordScreenProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    data: otpInfo,
    mutate: forgotPassword,
    isPending: isForgotPending,
  } = useMutation<ForgotPassword, Error, string>({
    mutationKey: [AuthMutations.forgotPassword],
  });

  const {
    mutate: verifyOtp,
    isPending: isVerifyPending,
    isSuccess: isOtpVerified,
  } = useMutation<boolean, Error, VerifyOtpProps>({
    mutationKey: [AuthMutations.verifyOtp],
  });

  const {
    mutate: resetPassword,
    isPending: isResetPending,
    isSuccess: isResetSuccess,
  } = useMutation<never, Error, ResetPasswordProps>({
    mutationKey: [AuthMutations.resetPassword],
  });

  const handlePressForgot = () => {
    forgotPassword(email);
  };

  const handlePressVerify = () => {
    verifyOtp({ otp, otpKey: otpInfo!.otpKey });
  };

  const handlePressReset = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Confirm the two passwords match and try again."
      );
    } else {
      resetPassword({
        password,
        otp,
        otpKey: otpInfo!.otpKey,
      });
    }
  };

  return (
    <>
      {!otpInfo && (
        <SafeAreaView>
          <Text variant="bodyMedium">
            Enter your email and a reset password link will be sent to you.
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            inputMode="text"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.textInput}
            mode="outlined"
          />
          <Button
            disabled={!email || isForgotPending}
            onPress={handlePressForgot}
          >
            Reset password
          </Button>
        </SafeAreaView>
      )}

      {otpInfo && !isOtpVerified && (
        <>
          <Text variant="bodyMedium">
            Check your email for the 6 digit code and enter it here.
          </Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            autoComplete="one-time-code"
            inputMode="numeric"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.textInput}
            mode="outlined"
          />
          <Button
            disabled={!otp || isVerifyPending}
            onPress={handlePressVerify}
          >
            Verify
          </Button>
        </>
      )}

      {isOtpVerified && !isResetSuccess && (
        <>
          <Text variant="bodyMedium">Reset your password.</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            secureTextEntry={true}
            inputMode="text"
            style={styles.textInput}
            mode="outlined"
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="new-password"
            secureTextEntry={true}
            inputMode="text"
            style={styles.textInput}
            mode="outlined"
          />
          <Button
            disabled={!password || isResetPending}
            onPress={handlePressReset}
          >
            Verify
          </Button>
        </>
      )}

      {isResetSuccess && (
        <>
          <Text variant="bodyMedium">
            You may now login with your new password.
          </Text>
          <Button onPress={onDismiss}>OK</Button>
        </>
      )}
    </>
  );
};
