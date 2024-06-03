import React, { useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "~/network/api/services/auth-service";
import { createStyleSheet } from "./style";

interface ForgotPasswordProps {
  onDismiss?: () => void;
}
export const ForgotPassword = ({ onDismiss }: ForgotPasswordProps) => {
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);

  const [email, setEmail] = useState<string>();
  const [otpKey, setOtpKey] = useState<string>();
  const [otp, setOtp] = useState<string>();
  const [isForgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [isPasswordChanged, setPasswordChanged] = useState(false);
  const [password, setPassword] = useState<string>();

  return (
    <>
      {!isForgotPasswordSent ? (
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
            disabled={!email}
            onPress={() => {
              forgotPassword(email!).then((result) => {
                if (result.success) {
                  setForgotPasswordSent(true);
                  setOtpKey(result.data!.otpKey);
                } else {
                  Alert.alert("Failed sending reset link", result.message);
                }
              });
            }}
          >
            Reset password
          </Button>
        </SafeAreaView>
      ) : !isOtpVerified ? (
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
            disabled={!otp}
            onPress={() => {
              verifyOtp(otp!, otpKey!).then((result) => {
                if (result.success) {
                  setOtpVerified(true);
                } else {
                  Alert.alert("Failed to verify code", result.message);
                }
              });
            }}
          >
            Verify
          </Button>
        </>
      ) : !isPasswordChanged ? (
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
          <Button
            disabled={!password}
            onPress={() => {
              resetPassword(password!, otp!, otpKey!).then((result) => {
                if (result.success) {
                  setPasswordChanged(true);
                } else {
                  Alert.alert("Failed to verify code", result.message);
                }
              });
            }}
          >
            Verify
          </Button>
        </>
      ) : (
        <>
          <Text variant="bodyMedium">
            You may now login with your new password.
          </Text>
          <Button
            onPress={() => {
              onDismiss?.();
            }}
          >
            OK
          </Button>
        </>
      )}
    </>
  );
};
