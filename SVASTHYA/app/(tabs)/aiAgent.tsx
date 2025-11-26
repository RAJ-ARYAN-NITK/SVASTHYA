import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';

export default function AIAgentScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const [text, setText] = useState('');
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [isRecording, setIsRecording] = useState(false);

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Failed to start recording');
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(null);
        setIsRecording(false);
        await recording?.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording?.getURI();
        console.log('Recording stopped and stored at', uri);
        Alert.alert('Recording Finished', 'Audio recorded successfully!');
    }

    async function pickDocument() {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return;
            }

            console.log('Document picked:', result.assets[0]);
            Alert.alert('File Selected', `Selected: ${result.assets[0].name}`);
        } catch (err) {
            console.error('Error picking document:', err);
        }
    }

    const handleSend = () => {
        if (text.trim()) {
            console.log('Sending message:', text);
            setText('');
            // Here you would integrate with the backend
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.title}>Svasthya AI</ThemedText>
            </View>

            <View style={styles.content}>
                <View style={styles.emptyState}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
                        <IconSymbol name="brain.head.profile" size={40} color={theme.primary} />
                    </View>
                    <ThemedText type="subtitle" style={{ marginTop: 16 }}>How can I help you today?</ThemedText>
                    <ThemedText style={{ textAlign: 'center', color: theme.icon, marginTop: 8 }}>
                        Ask me about your health records, appointments, or upload a doctor's recording for analysis.
                    </ThemedText>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
                style={styles.inputContainer}
            >
                <View style={[styles.inputWrapper, { backgroundColor: theme.cardBackground }]}>
                    <TouchableOpacity onPress={pickDocument} style={styles.iconButton}>
                        <IconSymbol name="paperclip" size={20} color={theme.icon} />
                    </TouchableOpacity>

                    <TextInput
                        placeholder={isRecording ? "Recording..." : "Ask Svasthya AI..."}
                        placeholderTextColor={theme.icon}
                        style={[styles.input, { color: theme.text }]}
                        value={text}
                        onChangeText={setText}
                        editable={!isRecording}
                    />

                    <TouchableOpacity
                        onPress={isRecording ? stopRecording : startRecording}
                        style={[styles.iconButton, isRecording && { backgroundColor: '#ff4444', borderRadius: 20 }]}
                    >
                        <IconSymbol
                            name={isRecording ? "stop.fill" : "mic.fill"}
                            size={20}
                            color={isRecording ? "#fff" : theme.icon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.primary }]}
                        onPress={handleSend}
                    >
                        <IconSymbol name="arrow.up" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        maxWidth: 300,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        padding: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: 40,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
