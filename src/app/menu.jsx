import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Film, Layers, Music, ArrowLeft } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function MainMenu() {
  const insets = useSafeAreaInsets();
  const { userType } = useLocalSearchParams();
  const isAdmin = userType === "hc7";

  // Animation values
  const clipsScale = useRef(new Animated.Value(1)).current;
  const overlaysScale = useRef(new Animated.Value(1)).current;
  const audiosScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleButtonPress = (scale, route, enabled = true) => {
    if (!enabled) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push(`/${route}?userType=${userType}`);
    });
  };

  const handleButtonPressIn = (scale, enabled = true) => {
    if (!enabled) return;
    Animated.timing(scale, {
      toValue: 1.05,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = (scale, enabled = true) => {
    if (!enabled) return;
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const menuItems = [
    {
      title: "Clips",
      subtitle: "Football player clips",
      icon: Film,
      scale: clipsScale,
      route: "clips",
      enabled: true,
      gradient: ["#00BFFF", "#0080CC"],
    },
    {
      title: "Overlays",
      subtitle: "Video overlays & effects",
      icon: Layers,
      scale: overlaysScale,
      route: "overlays",
      enabled: true,
      gradient: ["#00FF80", "#00CC66"],
    },
    {
      title: "Audios",
      subtitle: "Background music & sounds",
      icon: Music,
      scale: audiosScale,
      route: "audios",
      enabled: true,
      gradient: ["#FF6B6B", "#FF4444"],
    },
  ];

  return (
    <View
      style={{ flex: 1, backgroundColor: "#121212", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      {/* Background */}
      <LinearGradient
        colors={["#121212", "#1a1a1a", "#0d1421"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              marginLeft: 8,
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "Inter_500Medium",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: isAdmin
              ? "rgba(0, 191, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isAdmin ? "#00BFFF" : "rgba(255, 255, 255, 0.3)",
          }}
        >
          <Text
            style={{
              color: isAdmin ? "#00BFFF" : "#FFFFFF",
              fontSize: 12,
              fontWeight: "600",
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {isAdmin ? "HC7" : "VISITOR"}
          </Text>
        </View>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: 60 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 12,
              fontFamily: "Inter_700Bold",
            }}
          >
            Main Menu
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#CCCCCC",
              textAlign: "center",
              fontFamily: "Inter_400Regular",
            }}
          >
            Choose a section to explore
          </Text>
        </View>

        {/* Menu Buttons */}
        <View style={{ gap: 20 }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <Animated.View
                key={item.title}
                style={{
                  transform: [{ scale: item.scale }],
                  opacity: item.enabled ? 1 : 0.5,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 20,
                    padding: 24,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor: item.enabled
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.05)",
                    minHeight: 120,
                    justifyContent: "center",
                    shadowColor: item.enabled
                      ? item.gradient[0]
                      : "transparent",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    elevation: item.enabled ? 8 : 0,
                    flexDirection: "row",
                  }}
                  onPress={() =>
                    handleButtonPress(item.scale, item.route, item.enabled)
                  }
                  onPressIn={() =>
                    handleButtonPressIn(item.scale, item.enabled)
                  }
                  onPressOut={() =>
                    handleButtonPressOut(item.scale, item.enabled)
                  }
                  activeOpacity={item.enabled ? 0.8 : 1}
                  disabled={!item.enabled}
                >
                  {/* Icon Container */}
                  <LinearGradient
                    colors={
                      item.enabled ? item.gradient : ["#666666", "#555555"]
                    }
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      marginRight: 20,
                    }}
                  >
                    <IconComponent size={32} color="#FFFFFF" />
                  </LinearGradient>

                  {/* Text Content */}
                  <View style={{ flex: 1, alignItems: "flex-start" }}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                        marginBottom: 4,
                        fontFamily: "Inter_700Bold",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: item.enabled ? "#CCCCCC" : "#888888",
                        fontFamily: "Inter_400Regular",
                      }}
                    >
                      {item.subtitle}
                      {!item.enabled && " (Coming Soon)"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Footer Info */}
        <View
          style={{
            marginTop: 40,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#666666",
              textAlign: "center",
              fontFamily: "Inter_400Regular",
            }}
          >
            HC7 TikTok Editing Hub v1.0
          </Text>
          {isAdmin && (
            <Text
              style={{
                fontSize: 12,
                color: "#00BFFF",
                textAlign: "center",
                marginTop: 4,
                fontFamily: "Inter_400Regular",
              }}
            >
              Admin features enabled
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
