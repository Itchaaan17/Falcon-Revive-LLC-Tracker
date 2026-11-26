import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Role = "Employee" | "HR" | "CEO";
const gold = "#D9AA35";
const roles: Role[] = ["Employee", "HR", "CEO"];

export default function App() {
  const [role, setRole] = useState<Role>("Employee");
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
          <Text style={styles.time}>--:--</Text>
          <Text style={styles.muted}>Sign in to view your live attendance status.</Text>
          <View style={styles.disabledButton}><Text style={styles.buttonText}>TIME IN · GPS REQUIRED</Text></View>
          <Text style={styles.note}>Location verification and attendance actions will activate after secure account setup.</Text>
        </View> : <View style={styles.card}>
          <Text style={styles.cardLabel}>{role.toUpperCase()} OVERVIEW</Text>
          <Text style={styles.headingSmall}>Company attendance</Text>
          <View style={styles.metricRow}><Metric label="Present" value="—" /><Metric label="Late" value="—" /><Metric label="Missing" value="—" /></View>
          <Text style={styles.note}>Live employee data will appear after the Supabase database and role permissions are configured.</Text>
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
  card:{backgroundColor:"#151515",borderColor:"#37302A",borderWidth:1,borderRadius:18,padding:20,marginTop:8},cardLabel:{color:gold,fontSize:10,fontWeight:"800",letterSpacing:1.5},time:{color:"#F7F7F7",fontSize:52,fontWeight:"800",marginTop:12},disabledButton:{backgroundColor:"#4A3A18",borderRadius:12,padding:16,alignItems:"center",marginTop:22},buttonText:{color:"#E8C66F",fontWeight:"800",fontSize:12,letterSpacing:1},note:{color:"#858585",fontSize:11,lineHeight:17,marginTop:18},metricRow:{flexDirection:"row",gap:10,marginTop:20},metric:{flex:1,backgroundColor:"#202020",padding:14,borderRadius:12},metricValue:{color:gold,fontSize:26,fontWeight:"800"},footer:{color:"#686868",fontSize:9,letterSpacing:1.2,textAlign:"center",marginTop:40}
});
