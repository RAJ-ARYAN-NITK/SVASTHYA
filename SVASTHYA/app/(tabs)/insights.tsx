import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function InsightsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <IconSymbol name="chevron.left" size={24} color={theme.text} />
                </TouchableOpacity>
                <ThemedText type="title" style={styles.title}>Lab Reports</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Upload Card */}
                <View style={[styles.card, { backgroundColor: theme.cardBackground, alignItems: 'center', paddingVertical: 40 }]}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
                        <IconSymbol name="doc.text" size={32} color={theme.primary} />
                    </View>
                    <ThemedText type="subtitle" style={{ marginTop: 16 }}>Upload your lab report</ThemedText>
                    <ThemedText style={{ textAlign: 'center', color: theme.icon, marginTop: 8, paddingHorizontal: 20 }}>
                        Upload your lab report in PDF format to get insights into your health metrics.
                    </ThemedText>

                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary, marginTop: 24 }]}>
                        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Upload Report</ThemedText>
                    </TouchableOpacity>
                </View>

                <ThemedText type="subtitle" style={{ marginTop: 32, marginBottom: 16 }}>Extracted Metrics</ThemedText>

                {/* Metric Item */}
                <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
                    <View>
                        <ThemedText type="defaultSemiBold">Hemoglobin</ThemedText>
                        <ThemedText style={{ color: theme.icon }}>14.5 g/dL</ThemedText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
                        <ThemedText style={{ color: theme.success, fontSize: 12, fontWeight: '600' }}>Normal</ThemedText>
                        <View style={[styles.dot, { backgroundColor: theme.success }]} />
                    </View>
                </View>

                <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
                    <View>
                        <ThemedText type="defaultSemiBold">Glucose</ThemedText>
                        <ThemedText style={{ color: theme.icon }}>95 mg/dL</ThemedText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
                        <ThemedText style={{ color: theme.success, fontSize: 12, fontWeight: '600' }}>Normal</ThemedText>
                        <View style={[styles.dot, { backgroundColor: theme.success }]} />
                    </View>
                </View>

                <View style={[styles.metricCard, { backgroundColor: theme.cardBackground }]}>
                    <View>
                        <ThemedText type="defaultSemiBold">Red Blood Cells</ThemedText>
                        <ThemedText style={{ color: theme.icon }}>4.8 million/uL</ThemedText>
                    </View>
                    <View style={[styles.badge, { backgroundColor: theme.success + '20' }]}>
                        <ThemedText style={{ color: theme.success, fontSize: 12, fontWeight: '600' }}>Normal</ThemedText>
                        <View style={[styles.dot, { backgroundColor: theme.success }]} />
                    </View>
                </View>

                <TouchableOpacity style={[styles.insightButton, { backgroundColor: theme.secondary }]}>
                    <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>What does this mean?</ThemedText>
                </TouchableOpacity>
                <ThemedText style={{ color: theme.icon, fontSize: 10, textAlign: 'center', marginTop: 12 }}>
                    AI-generated insights based on previous history.
                </ThemedText>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
    },
    content: {
        padding: 20,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    metricCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 6,
    },
    insightButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
});
