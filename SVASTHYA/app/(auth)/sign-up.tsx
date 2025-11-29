import * as React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/ctx';
import { register, googleLogin } from '@/services/api';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Warm up the android browser to improve UX
        // https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { signIn } = useSession();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const [name, setName] = React.useState('');
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const onSignUpPress = async () => {
        if (!name || !emailAddress || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register({ name, email: emailAddress, password });
            await signIn(emailAddress, password);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignUpPress = React.useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/(tabs)', { scheme: 'svasthya' }),
            });

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                router.replace('/(tabs)');
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error('OAuth error', err);
            setError('Google Sign Up failed');
        }
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.formContainer}>
                <Text style={[styles.title, { color: theme.text }]}>
                    Create Account
                </Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        value={name}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        onChangeText={(text) => setName(text)}
                        style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                    />
                </View>

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
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={onSignUpPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={[styles.line, { backgroundColor: theme.icon }]} />
                    <Text style={[styles.orText, { color: theme.icon }]}>OR</Text>
                    <View style={[styles.line, { backgroundColor: theme.icon }]} />
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', flexDirection: 'row', gap: 10 }]}
                    onPress={onGoogleSignUpPress}
                >
                    <Ionicons name="logo-google" size={20} color="black" />
                    <Text style={[styles.buttonText, { color: 'black' }]}>Sign up with Google</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={{ color: theme.text }}>Already have an account? </Text>
                    <Link href="/sign-in" asChild>
                        <TouchableOpacity>
                            <Text style={[styles.link, { color: theme.tint }]}>Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 10,
    },
});
