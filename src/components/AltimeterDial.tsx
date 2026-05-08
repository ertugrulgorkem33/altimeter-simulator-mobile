import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G, Polygon, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { COLORS } from '../styles/theme';

const CX = 160;
const CY = 160;
const R = 148;

// Matematiksel Açı ve Koordinat Hesaplamaları (TypeScript tipleri eklendi)
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function mapAngle(ft: number) {
  return -120 + (ft / 10000) * 360;
}

// Dışarıdan gelecek verilerin (propların) tiplerini tanımlıyoruz
interface AltimeterDialProps {
  altitude?: number;
  qnh?: number;
}

export default function AltimeterDial({ altitude = 0, qnh = 1013.25 }: AltimeterDialProps) {
  const largeFt = altitude % 10000;
  const smallFt = (altitude % 100000) / 10;
  const la = mapAngle(largeFt);
  const sa = mapAngle(smallFt % 10000);

  // Dış Kadran Çizgilerini ve Rakamlarını Oluşturma
  const ticks = [];
  for (let ft = 0; ft <= 10000; ft += 100) {
    const a = mapAngle(ft);
    const isMajor = ft % 1000 === 0;
    const isMid = ft % 500 === 0 && !isMajor;
    const inner = isMajor ? R - 24 : isMid ? R - 18 : R - 12;
    const outer = R - 4;
    const p1 = polar(CX, CY, inner, a);
    const p2 = polar(CX, CY, outer, a);
    
    ticks.push(
      <Line key={`line-${ft}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isMajor ? '#ccd4e8' : '#5a6070'} strokeWidth={isMajor ? 2.5 : isMid ? 1.5 : 1} strokeLinecap="round" />
    );

    if (isMajor) {
      const lp = polar(CX, CY, R - 40, a);
      ticks.push(
        <SvgText key={`text-${ft}`} x={lp.x} y={lp.y} textAnchor="middle" alignmentBaseline="central" fill="#c8d0e0" fontSize={ft === 0 ? 11 : 13} fontWeight="bold" fontFamily="monospace">
          {(ft / 1000).toString()}
        </SvgText>
      );
    }
  }

  // İç Çember ve On Binlik Rakamlar
  const innerNumbers = [];
  for (let k = 0; k <= 9; k++) {
    const ap = -120 + k * 36;
    const p1 = polar(CX, CY, 36, ap);
    const p2 = polar(CX, CY, 46, ap);
    innerNumbers.push(<Line key={`inner-line-${k}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3a3f50" strokeWidth={1.5} />);
    
    const lp = polar(CX, CY, 28, ap);
    innerNumbers.push(
      <SvgText key={`inner-text-${k}`} x={lp.x} y={lp.y} textAnchor="middle" alignmentBaseline="central" fill="#6a7088" fontSize={8} fontFamily="monospace">
        {k.toString()}
      </SvgText>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={320} height={320} viewBox="0 0 320 320">
        <Defs>
          <RadialGradient id="bgGrad" cx="40%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#1e2230" />
            <Stop offset="100%" stopColor="#0b0d14" />
          </RadialGradient>
        </Defs>

        {/* Ana Zemin */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#bgGrad)" stroke="#1a1d28" strokeWidth={2} />

        {/* Çizgiler */}
        {ticks}

        {/* İç Çember */}
        <Circle cx={CX} cy={CY} r={52} fill="none" stroke="#1c1f2a" strokeWidth={30} />
        {innerNumbers}

        {/* Yazılar */}
        <SvgText x={CX} y={CY - 70} textAnchor="middle" fill="#4a5060" fontSize={8.5} letterSpacing={2} fontFamily="monospace">ALTIMETER</SvgText>
        <SvgText x={CX} y={CY - 60} textAnchor="middle" fill="#3a4050" fontSize={7} letterSpacing={1.5} fontFamily="monospace">FEET/METRE</SvgText>

        {/* Basınç (QNH) Kutusu */}
        <Rect x={CX + 55} y={CY + 50} width={38} height={18} rx={3} fill="#0a0d14" stroke="#3a3f4b" strokeWidth={1} />
        <SvgText x={CX + 74} y={CY + 60} textAnchor="middle" alignmentBaseline="central" fill={COLORS.amber} fontSize={8.5} fontFamily="monospace">
          {Math.round(qnh).toString()}
        </SvgText>

        {/* Küçük İbre (10 Binler) */}
        <G rotation={sa} origin={`${CX}, ${CY}`}>
          <Polygon points={`${CX},${CY-46} ${CX-4},${CY-10} ${CX+4},${CY-10}`} fill="#a0a8c0" opacity={0.9} />
          <Polygon points={`${CX},${CY+16} ${CX-3},${CY+6} ${CX+3},${CY+6}`} fill="#4a5060" />
        </G>

        {/* Büyük İbre (100'ler ve 1000'ler) */}
        <G rotation={la} origin={`${CX}, ${CY}`}>
          <Polygon points={`${CX},${CY-130} ${CX-5},${CY-40} ${CX+5},${CY-40}`} fill="#e8ecf8" />
          <Polygon points={`${CX-3},${CY-40} ${CX+3},${CY-40} ${CX+4},${CY+20} ${CX-4},${CY+20}`} fill="#c0c8dc" />
          <Polygon points={`${CX},${CY+30} ${CX-5},${CY+18} ${CX+5},${CY+18}`} fill="#555a6a" />
        </G>

        {/* Merkez Vida */}
        <Circle cx={CX} cy={CY} r={9} fill="#2a2d3c" stroke="#4a5060" strokeWidth={1.5} />
        <Circle cx={CX} cy={CY} r={3.5} fill="#a0a8c0" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#2a2d38',
    borderColor: '#222530',
    borderWidth: 6,
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  }
});