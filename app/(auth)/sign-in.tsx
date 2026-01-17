import { Link, router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Welcome */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>B</Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to discover amazing local businesses
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Mail size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Lock size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Sign In (placeholders for future) */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <Link href={'/(auth)/sign-up' as any} asChild>
              <TouchableOpacity>
                <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
