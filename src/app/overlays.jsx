import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Modal, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Play, Download, Upload, Trash2, CheckSquare, Square } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OverlaysPage() {
  const insets = useSafeAreaInsets();
  const { userType } = useLocalSearchParams();
  const isAdmin = userType === 'hc7';
  
  const [selectedOverlays, setSelectedOverlays] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sample overlays data - in real app this would come from database
  const overlaysData = [
    { 
      id: 1, 
      title: 'Fire Effect', 
      thumbnail: 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'animated',
      duration: '2s' 
    },
    { 
      id: 2, 
      title: 'Smoke Overlay', 
      thumbnail: 'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'static',
      duration: null 
    },
    { 
      id: 3, 
      title: 'Lightning Effect', 
      thumbnail: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'animated',
      duration: '1.5s' 
    },
    { 
      id: 4, 
      title: 'Lens Flare', 
      thumbnail: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'static',
      duration: null 
    },
    { 
      id: 5, 
      title: 'Particle Burst', 
      thumbnail: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'animated',
      duration: '3s' 
    },
    { 
      id: 6, 
      title: 'Glitch Effect', 
      thumbnail: 'https://images.pexels.com/photos/2523959/pexels-photo-2523959.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2', 
      type: 'animated',
      duration: '0.5s' 
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleOverlaySelection = (overlayId) => {
    if (selectedOverlays.includes(overlayId)) {
      setSelectedOverlays(selectedOverlays.filter(id => id !== overlayId));
    } else {
      setSelectedOverlays([...selectedOverlays, overlayId]);
    }
  };

  const handleDeleteSelected = () => {
    // In real app, this would delete from database
    console.log('Deleting overlays:', selectedOverlays);
    setSelectedOverlays([]);
    setIsDeleteMode(false);
  };

  const handleDownloadAll = () => {
    // In real app, this would create and download a zip file
    console.log('Downloading all overlays');
  };

  const renderOverlayItem = ({ item, index }) => {
    const isSelected = selectedOverlays.includes(item.id);
    const itemWidth = (width - 60) / 2; // 2 columns with padding
    
    return (
      <View style={{ 
        width: itemWidth,
        marginBottom: 16,
        marginRight: index % 2 === 0 ? 12 : 0
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: isDeleteMode && isSelected ? 2 : 1,
            borderColor: isDeleteMode && isSelected ? '#00BFFF' : 'rgba(255, 255, 255, 0.1)'
          }}
          onPress={() => {
            if (isDeleteMode) {
              toggleOverlaySelection(item.id);
            } else {
              // Preview overlay
              console.log('Previewing overlay:', item.title);
            }
          }}
        >
          {/* Thumbnail */}
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: '100%',
                height: 120,
                backgroundColor: '#333'
              }}
              contentFit="cover"
              transition={200}
            />
            
            {/* Type Badge */}
            <View style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: item.type === 'animated' ? 'rgba(0, 191, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
            }}>
              <Text style={{
                color: item.type === 'animated' ? '#FFFFFF' : '#000000',
                fontSize: 10,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                {item.type === 'animated' ? 'ANIMATED' : 'STATIC'}
              </Text>
            </View>

            {/* Duration Badge (for animated overlays) */}
            {item.type === 'animated' && item.duration && (
              <View style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontFamily: 'Inter_500Medium'
                }}>
                  {item.duration}
                </Text>
              </View>
            )}

            {/* Play/Selection Icon */}
            <View style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -15 }, { translateY: -15 }],
              width: 30,
              height: 30,
              backgroundColor: isDeleteMode ? 'transparent' : 'rgba(0, 0, 0, 0.6)',
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {isDeleteMode ? (
                isSelected ? 
                  <CheckSquare size={24} color="#00BFFF" /> : 
                  <Square size={24} color="#FFFFFF" />
              ) : (
                <Play size={16} color="#FFFFFF" />
              )}
            </View>
          </View>

          {/* Overlay Info */}
          <View style={{ padding: 12 }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Inter_500Medium'
            }} numberOfLines={2}>
              {item.title}
            </Text>
            
            {!isDeleteMode && (
              <TouchableOpacity
                style={{
                  marginTop: 8,
                  backgroundColor: '#00BFFF',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => console.log('Downloading:', item.title)}
              >
                <Download size={14} color="#FFFFFF" />
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '500',
                  marginLeft: 4,
                  fontFamily: 'Inter_500Medium'
                }}>
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
    <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: insets.top }}>
      <StatusBar style="light" />
      
      {/* Background */}
      <LinearGradient
        colors={['#121212', '#1a1a1a', '#0d1421']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={{
            color: '#FFFFFF',
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '500',
            fontFamily: 'Inter_500Medium'
          }}>
            Back
          </Text>
        </TouchableOpacity>

        {/* Admin Controls */}
        {isAdmin && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setUploadModalVisible(true)}
              style={{
                backgroundColor: 'rgba(0, 191, 255, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#00BFFF',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Upload size={16} color="#00BFFF" />
              <Text style={{
                color: '#00BFFF',
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                Upload
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsDeleteMode(!isDeleteMode);
                setSelectedOverlays([]);
              }}
              style={{
                backgroundColor: isDeleteMode ? 'rgba(255, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDeleteMode ? '#FF4444' : 'rgba(255, 255, 255, 0.3)',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Trash2 size={16} color={isDeleteMode ? '#FF4444' : '#FFFFFF'} />
              <Text style={{
                color: isDeleteMode ? '#FF4444' : '#FFFFFF',
                marginLeft: 4,
                fontSize: 12,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                {isDeleteMode ? 'Cancel' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Title */}
        <View style={{ alignItems: 'center', marginBottom: 24, paddingHorizontal: 24 }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Inter_700Bold'
          }}>
            Video Overlays
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: '#CCCCCC',
            textAlign: 'center',
            marginTop: 8,
            fontFamily: 'Inter_400Regular'
          }}>
            Static images and animated effects
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          paddingHorizontal: 24, 
          marginBottom: 20 
        }}>
          <TouchableOpacity
            onPress={handleDownloadAll}
            style={{
              backgroundColor: 'rgba(0, 191, 255, 0.2)',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#00BFFF',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Download size={18} color="#00BFFF" />
            <Text style={{
              color: '#00BFFF',
              marginLeft: 8,
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold'
            }}>
              Download All ({overlaysData.length})
            </Text>
          </TouchableOpacity>

          {isDeleteMode && selectedOverlays.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteSelected}
              style={{
                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#FF4444',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Trash2 size={18} color="#FF4444" />
              <Text style={{
                color: '#FF4444',
                marginLeft: 8,
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                Delete ({selectedOverlays.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Overlays Grid */}
        <FlatList
          data={overlaysData}
          numColumns={2}
          renderItem={renderOverlayItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: insets.bottom + 20
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
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24
        }}>
          <View style={{
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: 16,
              fontFamily: 'Inter_600SemiBold'
            }}>
              Upload Overlay
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: '#CCCCCC',
              textAlign: 'center',
              marginBottom: 24,
              fontFamily: 'Inter_400Regular'
            }}>
              Upload functionality will be implemented with file picker for images and videos
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#00BFFF',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center'
              }}
              onPress={() => setUploadModalVisible(false)}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}