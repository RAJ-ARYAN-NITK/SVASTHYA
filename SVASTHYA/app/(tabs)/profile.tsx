import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const { signOut } = useAuth();
    const { user } = useUser();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ThemedText type="title">Profile</ThemedText>
            <ThemedText style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</ThemedText>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.tint }]}
                onPress={() => signOut()}
            >
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    email: {
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
