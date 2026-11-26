import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

type Role = "Employee" | "HR" | "CEO";
const gold = "#D9AA35";
const roles: Role[] = ["Employee", "HR", "CEO"];
const SHOP = { latitude: 25.2322961, longitude: 55.3735389 };
const RADIUS_METERS = 40;

function distanceMeters(a: {latitude:number;longitude:number}, b: {latitude:number;longitude:number}) {
  const rad = (v:number) => v * Math.PI / 180;
  const dLat = rad(b.latitude-a.latitude);
  const dLon = rad(b.longitude-a.longitude);
  const x = Math.sin(dLat/2)**2 + Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dLon/2)**2;
  return 6371000 * 2 * Math.asin(Math.sqrt(x));
}
function dubaiTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {timeZone:"Asia/Dubai",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(date);
  return {hour:Number(parts.find(p=>p.type==="hour")?.value ?? 0),minute:Number(parts.find(p=>p.type==="minute")?.value ?? 0)};
}
export default function App() {
  const [role, setRole] = useState<Role>("Employee");
  const [checking, setChecking] = useState(false);
  const [gpsMessage, setGpsMessage] = useState("Tap CHECK GPS to verify that you are at the shop.");
  const [distance, setDistance] = useState<number|null>(null);
  const [accuracy, setAccuracy] = useState<number|null>(null);
  const [inside, setInside] = useState(false);
  const [gpsTimeAllowed, setGpsTimeAllowed] = useState(false);

  async function checkGps() {
    setChecking(true); setInside(false); setDistance(null); setAccuracy(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setGpsMessage("Location permission is required. Please allow location access in iPhone Settings.");
        return;
      }
      const current = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      const meters = distanceMeters(
        {latitude:current.coords.latitude,longitude:current.coords.longitude},
        SHOP
      );
      const within = meters <= RADIUS_METERS;
      const {hour,minute} = dubaiTimeParts(new Date());
      const minuteOfDay = hour*60+minute;
      const timeAllowed = minuteOfDay >= 8*60 && minuteOfDay <= 19*60;
      setDistance(meters); setAccuracy(current.coords.accuracy ?? null);
      setInside(within); setGpsTimeAllowed(timeAllowed);
      setGpsMessage(within
        ? (timeAllowed ? "GPS check passed. You are inside the 40 m shop area and within the time-in window." : "You are at the shop, but time-in is only allowed from 8:00 AM to 7:00 PM Dubai time.")
        : "GPS check failed. Move closer to the shop; you must be within 40 meters.");
    } catch (error) {
      setGpsMessage("Could not get your location. Turn on Location Services and try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.brandMark}><Text style={styles.falcon}>F</Text></View>
        <Text style={styles.brand}>FALCON <Text style={styles.gold}>REVIVE</Text></Text>
        <Text style={styles.subtitle}>LLC TRACKER · DUBAI</Text>
        <View style={styles.rule} />
        <Text style={styles.eyebrow}>WORKFORCE MANAGEMENT</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.muted}>Choose your workspace preview.</Text>
        <View style={styles.roles}>
          {roles.map(item => <TouchableOpacity key={item} onPress={() => setRole(item)} style={[styles.role, role === item && styles.roleActive]}><Text style={[styles.roleText, role === item && styles.roleTextActive]}>{item}</Text></TouchableOpacity>)}
        </View>
        {role === "Employee" ? <View style={styles.card}>
          <Text style={styles.cardLabel}>TODAY'S ATTENDANCE</Text>
          <Text style={styles.time}>GPS CHECK</Text>
          <Text style={styles.muted}>Shop geofence: 40 meters · Time-in: 8:00 AM–7:00 PM Dubai time</Text>
          <TouchableOpacity onPress={checkGps} disabled={checking} style={styles.button}>
            {checking ? <ActivityIndicator color="#17130A" /> : <Text style={styles.buttonText}>CHECK GPS LOCATION</Text>}
          </TouchableOpacity>
          {distance !== null && <View style={styles.result}>
            <Text style={styles.resultTitle}>{inside ? "INSIDE SHOP AREA" : "OUTSIDE SHOP AREA"}</Text>
            <Text style={styles.resultLine}>Distance from shop: {distance.toFixed(1)} m</Text>
            {accuracy !== null && <Text style={styles.resultLine}>GPS accuracy: ±{accuracy.toFixed(1)} m</Text>}
            <Text style={styles.resultLine}>Time-in window: {gpsTimeAllowed ? "OPEN" : "CLOSED"}</Text>
          </View>}
          <Text style={styles.note}>{gpsMessage}</Text>
          <Text style={styles.note}>This is a GPS verification preview only. Actual Time In / Time Out recording will be enabled after Google sign-in and secure Supabase attendance integration.</Text>
        </View> : <View style={styles.card}>
          <Text style={styles.cardLabel}>{role.toUpperCase()} OVERVIEW</Text>
          <Text style={styles.headingSmall}>Company attendance</Text>
          <View style={styles.metricRow}><Metric label="Present" value="—" /><Metric label="Late" value="—" /><Metric label="Missing" value="—" /></View>
          <Text style={styles.note}>Live employee data will appear after secure account setup.</Text>
        </View>}
        <Text style={styles.footer}>SECURE · ROLE-BASED · AUTOMOTIVE WORKFORCE</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
function Metric({label,value}:{label:string;value:string}) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{label}</Text></View>; }
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#090909"},page:{padding:24,paddingTop:36,maxWidth:620,width:"100%",alignSelf:"center"},
  brandMark:{width:54,height:54,borderWidth:1,borderColor:gold,borderRadius:16,alignItems:"center",justifyContent:"center",marginBottom:18,backgroundColor:"#15120B"},
  falcon:{fontSize:32,fontWeight:"900",color:gold,fontStyle:"italic"},brand:{fontSize:25,fontWeight:"900",letterSpacing:1.5,color:"#F5F5F5"},gold:{color:gold},subtitle:{color:"#A6A6A6",fontSize:11,letterSpacing:3,marginTop:5},
  rule:{height:1,backgroundColor:"#3A3020",marginVertical:28},eyebrow:{color:gold,fontSize:10,fontWeight:"800",letterSpacing:2},heading:{fontSize:30,fontWeight:"800",color:"#F7F7F7",marginTop:10},headingSmall:{fontSize:20,fontWeight:"800",color:"#F7F7F7",marginTop:12},muted:{color:"#A4A4A4",fontSize:13,marginTop:7},
  roles:{flexDirection:"row",gap:8,marginTop:24,marginBottom:18},role:{flex:1,paddingVertical:13,borderRadius:12,borderWidth:1,borderColor:"#393939",alignItems:"center"},roleActive:{backgroundColor:"#2A2110",borderColor:gold},roleText:{color:"#AFAFAF",fontWeight:"700"},roleTextActive:{color:gold},
  card:{backgroundColor:"#151515",borderColor:"#37302A",borderWidth:1,borderRadius:18,padding:20,marginTop:8},cardLabel:{color:gold,fontSize:10,fontWeight:"800",letterSpacing:1.5},time:{color:"#F7F7F7",fontSize:32,fontWeight:"800",marginTop:12},button:{backgroundColor:gold,borderRadius:12,padding:16,alignItems:"center",justifyContent:"center",marginTop:22,minHeight:52},buttonText:{color:"#17130A",fontWeight:"900",fontSize:12,letterSpacing:1},result:{backgroundColor:"#202020",borderRadius:12,padding:14,marginTop:16},resultTitle:{color:gold,fontWeight:"900",fontSize:12,letterSpacing:1},resultLine:{color:"#E0E0E0",fontSize:12,marginTop:7},note:{color:"#858585",fontSize:11,lineHeight:17,marginTop:16},
  metricRow:{flexDirection:"row",gap:10,marginTop:20},metric:{flex:1,backgroundColor:"#202020",padding:14,borderRadius:12},metricValue:{color:gold,fontSize:26,fontWeight:"800"},footer:{color:"#686868",fontSize:9,letterSpacing:1.2,textAlign:"center",marginTop:40}
});