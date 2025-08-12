import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Play,
  Download,
  Upload,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function ClipsPage() {
  const insets = useSafeAreaInsets();
  const { userType } = useLocalSearchParams();
  const isAdmin = userType === "hc7";

  const [selectedCategory, setSelectedCategory] = useState("Ronaldo");
  const [selectedClips, setSelectedClips] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

  const categories = ["Ronaldo", "Messi", "Neymar", "Mbappé", "Yamal"];

  // Sample clips data - in real app this would come from database
  const clipsData = {
    Ronaldo: [],
    Messi: [],
    Neymar: [],
    Mbappé: [],
    Yamal: [],
  };

  const currentClips = clipsData[selectedCategory] || [];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const categoryIndex = categories.indexOf(selectedCategory);
    const tabWidth = (width - 48) / categories.length;
    Animated.timing(tabIndicatorPosition, {
      toValue: categoryIndex * tabWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedCategory]);

  const toggleClipSelection = (clipId) => {
    if (selectedClips.includes(clipId)) {
      setSelectedClips(selectedClips.filter((id) => id !== clipId));
    } else {
      setSelectedClips([...selectedClips, clipId]);
    }
  };

  const handleDeleteSelected = () => {
    // In real app, this would delete from database
    console.log("Deleting clips:", selectedClips);
    setSelectedClips([]);
    setIsDeleteMode(false);
  };

  const handleDownloadAll = () => {
    // In real app, this would create and download a zip file
    console.log("Downloading all clips for category:", selectedCategory);
  };

  const renderClipItem = ({ item, index }) => {
    const isSelected = selectedClips.includes(item.id);
    const itemWidth = (width - 60) / 2; // 2 columns with padding

    return (
      <View
        style={{
          width: itemWidth,
          marginBottom: 16,
          marginRight: index % 2 === 0 ? 12 : 0,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: isDeleteMode && isSelected ? 2 : 1,
            borderColor:
              isDeleteMode && isSelected
                ? "#00BFFF"
                : "rgba(255, 255, 255, 0.1)",
          }}
          onPress={() => {
            if (isDeleteMode) {
              toggleClipSelection(item.id);
            } else {
              // Play video preview
              console.log("Playing clip:", item.title);
            }
          }}
        >
          {/* Thumbnail */}
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: "100%",
                height: 120,
                backgroundColor: "#333",
              }}
              contentFit="cover"
              transition={200}
            />

            {/* Duration Badge */}
            <View
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontFamily: "Inter_500Medium",
                }}
              >
                {item.duration}
              </Text>
            </View>

            {/* Play/Selection Icon */}
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: -15 }, { translateY: -15 }],
                width: 30,
                height: 30,
                backgroundColor: isDeleteMode
                  ? "transparent"
                  : "rgba(0, 0, 0, 0.6)",
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isDeleteMode ? (
                isSelected ? (
                  <CheckSquare size={24} color="#00BFFF" />
                ) : (
                  <Square size={24} color="#FFFFFF" />
                )
              ) : (
                <Play size={16} color="#FFFFFF" />
              )}
            </View>
          </View>

          {/* Clip Info */}
          <View style={{ padding: 12 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "500",
                fontFamily: "Inter_500Medium",
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {!isDeleteMode && (
              <TouchableOpacity
                style={{
                  marginTop: 8,
                  backgroundColor: "#00BFFF",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => console.log("Downloading:", item.title)}
              >
                <Download size={14} color="#FFFFFF" />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: "500",
                    marginLeft: 4,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  Download
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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

        {/* Admin Controls */}
        {isAdmin && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setUploadModalVisible(true)}
              style={{
                backgroundColor: "rgba(0, 191, 255, 0.2)",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#00BFFF",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Upload size={16} color="#00BFFF" />
              <Text
                style={{
                  color: "#00BFFF",
                  marginLeft: 4,
                  fontSize: 12,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Upload
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsDeleteMode(!isDeleteMode);
                setSelectedClips([]);
              }}
              style={{
                backgroundColor: isDeleteMode
                  ? "rgba(255, 68, 68, 0.2)"
                  : "rgba(255, 255, 255, 0.1)",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDeleteMode
                  ? "#FF4444"
                  : "rgba(255, 255, 255, 0.3)",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Trash2 size={16} color={isDeleteMode ? "#FF4444" : "#FFFFFF"} />
              <Text
                style={{
                  color: isDeleteMode ? "#FF4444" : "#FFFFFF",
                  marginLeft: 4,
                  fontSize: 12,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {isDeleteMode ? "Cancel" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Title */}
        <View
          style={{
            alignItems: "center",
            marginBottom: 24,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              fontFamily: "Inter_700Bold",
            }}
          >
            Football Clips
          </Text>
        </View>

        {/* Category Tabs */}
        <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
          <View style={{ position: "relative" }}>
            {/* Tab Indicator */}
            <Animated.View
              style={{
                position: "absolute",
                bottom: 0,
                height: 2,
                backgroundColor: "#00BFFF",
                width: (width - 48) / categories.length,
                transform: [{ translateX: tabIndicatorPosition }],
                borderRadius: 1,
              }}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      minWidth: (width - 48) / categories.length,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          selectedCategory === category ? "#00BFFF" : "#CCCCCC",
                        fontSize: 16,
                        fontWeight:
                          selectedCategory === category ? "600" : "400",
                        fontFamily:
                          selectedCategory === category
                            ? "Inter_600SemiBold"
                            : "Inter_400Regular",
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleDownloadAll}
            style={{
              backgroundColor: "rgba(0, 191, 255, 0.2)",
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#00BFFF",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Download size={18} color="#00BFFF" />
            <Text
              style={{
                color: "#00BFFF",
                marginLeft: 8,
                fontSize: 14,
                fontWeight: "600",
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Download All ({currentClips.length})
            </Text>
          </TouchableOpacity>

          {isDeleteMode && selectedClips.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteSelected}
              style={{
                backgroundColor: "rgba(255, 68, 68, 0.2)",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#FF4444",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Trash2 size={18} color="#FF4444" />
              <Text
                style={{
                  color: "#FF4444",
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Delete ({selectedClips.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Clips Grid */}
        <FlatList
          data={currentClips}
          numColumns={2}
          renderItem={renderClipItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>

      {/* Upload Modal */}
      <Modal
        visible={uploadModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUploadModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(26, 26, 26, 0.95)",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 16,
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Upload Clip
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#CCCCCC",
                textAlign: "center",
                marginBottom: 24,
                fontFamily: "Inter_400Regular",
              }}
            >
              Upload functionality will be implemented with file picker
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#00BFFF",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
              }}
              onPress={() => setUploadModalVisible(false)}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
