import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Goal, Initiative, Saboteur, ProgressChips } from '@/context/GoalContext';

// Register fonts if needed, for now standard Helvetica/Times
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        color: '#4B0082', // Indigo/Purple
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666666',
    },
    section: {
        marginBottom: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 8,
        color: '#4B0082',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 4,
        fontWeight: 'bold',
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#e0e0e0',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e0e0e0',
        padding: 5,
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e0e0e0',
        backgroundColor: '#f3f4f6',
        padding: 5,
    },
    textSmall: {
        fontSize: 8,
    },
    textBold: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    categoryTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4B0082',
        marginTop: 5,
        marginBottom: 2,
    },
    rowItem: {
        fontSize: 9,
        marginBottom: 2,
    },
    chipsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    chipBlock: {
        alignItems: 'center',
    },
});

interface PDFDocumentProps {
    goals: Goal[];
    initiatives: Initiative[];
    saboteurs: Saboteur[];
    chips: ProgressChips;
    focusPillar: string;
}

export const PDFDocument = ({ goals, initiatives, saboteurs, chips, focusPillar }: PDFDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Planejamento de Vida Premium</Text>
            <Text style={styles.subtitle}>Transformando sonhos em realidade</Text>

            {/* Focus Pillar */}
            <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                <Text style={{ fontSize: 10, textAlign: 'center', color: '#444' }}>FOCO E ENERGIA (F.E.) PRINCIPAL</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', color: '#4B0082', fontWeight: 'bold' }}>
                    {focusPillar || "Não definido"}
                </Text>
            </View>

            {/* 5 Chips Distribution */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Distribuição de Fichas (5 Máx)</Text>
                <View style={styles.chipsContainer}>
                    <View style={styles.chipBlock}>
                        <Text style={styles.textBold}>FINANCEIRO</Text>
                        <Text style={{ fontSize: 20 }}>{chips.finance}</Text>
                    </View>
                    <View style={styles.chipBlock}>
                        <Text style={styles.textBold}>SAÚDE</Text>
                        <Text style={{ fontSize: 20 }}>{chips.health}</Text>
                    </View>
                    <View style={styles.chipBlock}>
                        <Text style={styles.textBold}>RELACIONAMENTO</Text>
                        <Text style={{ fontSize: 20 }}>{chips.relationships}</Text>
                    </View>
                </View>
            </View>

            {/* Goals & Initiatives */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Metas e Planos de Ação</Text>
                {goals.map((goal) => {
                    const goalInitiatives = initiatives.filter(i => i.goalId === goal.id && i.type === 'initiative');
                    const goalRoutines = initiatives.filter(i => i.goalId === goal.id && i.type === 'routine');

                    return (
                        <View key={goal.id} wrap={false} style={{ marginBottom: 15, padding: 10, border: '1pt solid #eee', borderRadius: 4 }}>
                            <Text style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>{goal.category}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>{goal.what}</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text style={{ fontSize: 9 }}>Meta: <Text style={{ color: '#4B0082' }}>{goal.number}</Text></Text>
                                <Text style={{ fontSize: 9 }}>Prazo: <Text style={{ color: '#4B0082' }}>{goal.when}</Text></Text>
                                <Text style={{ fontSize: 9 }}>Métrica: <Text style={{ color: '#4B0082' }}>{goal.metric}</Text></Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={{ width: '50%', paddingRight: 5 }}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Iniciativas:</Text>
                                    {goalInitiatives.length > 0 ? (
                                        goalInitiatives.map(i => <Text key={i.id} style={{ fontSize: 8, marginBottom: 1 }}>• {i.text}</Text>)
                                    ) : <Text style={{ fontSize: 8, fontStyle: 'italic', color: '#999' }}>Nenhuma iniciativa.</Text>}
                                </View>
                                <View style={{ width: '50%', paddingLeft: 5, borderLeft: '1pt solid #eee' }}>
                                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Rotinas:</Text>
                                    {goalRoutines.length > 0 ? (
                                        goalRoutines.map(i => <Text key={i.id} style={{ fontSize: 8, marginBottom: 1 }}>• {i.text}</Text>)
                                    ) : <Text style={{ fontSize: 8, fontStyle: 'italic', color: '#999' }}>Nenhuma rotina.</Text>}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Saboteurs */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sabotadores e Antídotos</Text>
                {saboteurs.map((s, idx) => (
                    <View key={s.id} style={{ flexDirection: 'row', marginBottom: 4, paddingBottom: 4, borderBottom: '1pt dotted #eee' }}>
                        <Text style={{ width: '50%', fontSize: 9 }}>{idx + 1}. {s.name}</Text>
                        <Text style={{ width: '50%', fontSize: 9, color: '#4B0082' }}>{`->`} {s.action}</Text>
                    </View>
                ))}
                {saboteurs.length === 0 && <Text style={{ fontSize: 9, fontStyle: 'italic' }}>Nenhum sabotador identificado.</Text>}
            </View>

            <Text style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#ccc' }}>
                Gerado via Planejador de Metas Premium
            </Text>
        </Page>
    </Document>
);
