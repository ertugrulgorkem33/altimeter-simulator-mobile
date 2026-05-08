import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../src/styles/theme';
import LeftPanel from '../src/components/LeftPanel';
import RightPanel from '../src/components/RightPanel';
import AltimeterDial from '../src/components/AltimeterDial';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⟨ Altimetre Simülatörü ⟩</Text>
          <Text style={styles.badge}>EGS DERSİ — KOKPİT GÖSTERGELERİ</Text>
        </View>

        {/* MAIN LAYOUT */}
        <View style={styles.mainLayout}>
          
          <LeftPanel />

          {/* INSTRUMENT: Altimetre Kadranı (SVG) */}
          <AltimeterDial altitude={0} qnh={1013.25} />

          <RightPanel />

        </View>

      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  header: { width: '100%', alignItems: 'center', marginBottom: 24, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.accent, letterSpacing: 2 },
  badge: { fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, marginTop: 5 },
  mainLayout: { width: '100%', maxWidth: 500, flexDirection: 'column', gap: 20 }
});