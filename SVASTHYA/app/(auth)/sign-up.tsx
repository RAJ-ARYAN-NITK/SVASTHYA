import * as React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }
        setLoading(true);
        setError('');

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }
        setLoading(true);
        setError('');

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || 'Failed to verify code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.formContainer}>
                <Text style={[styles.title, { color: theme.text }]}>
                    {pendingVerification ? 'Verify Email' : 'Create Account'}
                </Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {!pendingVerification && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                onChangeText={(email) => setEmailAddress(email)}
                                style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                value={password}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                secureTextEntry={true}
                                onChangeText={(password) => setPassword(password)}
                                style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.tint }]}
                            onPress={onSignUpPress}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={{ color: theme.text }}>Already have an account? </Text>
                            <Link href="/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text style={[styles.link, { color: theme.tint }]}>Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </>
                )}

                {pendingVerification && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={code}
                                placeholder="Verification Code"
                                placeholderTextColor="#999"
                                onChangeText={(code) => setCode(code)}
                                style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.tint }]}
                            onPress={onPressVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Verify Email</Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    link: {
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
});
