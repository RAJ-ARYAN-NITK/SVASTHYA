
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSession } from '@/ctx';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { signOut } = useSession();
    const router = useRouter();

    const handleSignOut = () => {
        signOut();
        router.replace('/(auth)/sign-in');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>user@example.com</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
