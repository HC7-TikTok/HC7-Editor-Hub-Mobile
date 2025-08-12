import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Modal, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Download, Upload, Trash2, CheckSquare, Square, Music, Volume2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AudiosPage() {
  const insets = useSafeAreaInsets();
  const { userType } = useLocalSearchParams();
  const isAdmin = userType === 'hc7';
  
  const [selectedAudios, setSelectedAudios] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Sample audio data - in real app this would come from database
  const audioData = [];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleAudioSelection = (audioId) => {
    if (selectedAudios.includes(audioId)) {
      setSelectedAudios(selectedAudios.filter(id => id !== audioId));
    } else {
      setSelectedAudios([...selectedAudios, audioId]);
    }
  };

  const handleDeleteSelected = () => {
    // In real app, this would delete from database
    console.log('Deleting audios:', selectedAudios);
    setSelectedAudios([]);
    setIsDeleteMode(false);
  };

  const handleDownloadAll = () => {
    // In real app, this would create and download a zip file
    console.log('Downloading all audio files');
  };

  const renderAudioItem = ({ item, index }) => {
    const isSelected = selectedAudios.includes(item.id);
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
              toggleAudioSelection(item.id);
            } else {
              // Play audio preview
              console.log('Playing audio:', item.title);
            }
          }}
        >
          {/* Audio Visual */}
          <View style={{ 
            position: 'relative',
            height: 120,
            backgroundColor: '#333',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Audio Wave Background */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'linear-gradient(45deg, #FF6B6B, #FF4444)',
              opacity: 0.3
            }}>
              <LinearGradient
                colors={['#FF6B6B', '#FF4444']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>

            {/* Music Icon */}
            <View style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: 16,
              borderRadius: 20
            }}>
              <Music size={32} color="#FFFFFF" />
            </View>
            
            {/* Duration Badge */}
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

            {/* Play/Selection Icon */}
            <View style={{
              position: 'absolute',
              top: 8,
              left: 8,
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
                <Volume2 size={16} color="#FFFFFF" />
              )}
            </View>
          </View>

          {/* Audio Info */}
          <View style={{ padding: 12 }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Inter_500Medium'
            }} numberOfLines={2}>
              {item.title}
            </Text>
            
            {item.artist && (
              <Text style={{
                color: '#CCCCCC',
                fontSize: 12,
                fontFamily: 'Inter_400Regular',
                marginTop: 2
              }} numberOfLines={1}>
                {item.artist}
              </Text>
            )}
            
            {!isDeleteMode && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={() => console.log('Playing:', item.title)}
                >
                  <Play size={12} color="#FF6B6B" />
                  <Text style={{
                    color: '#FF6B6B',
                    fontSize: 10,
                    fontWeight: '500',
                    marginLeft: 4,
                    fontFamily: 'Inter_500Medium'
                  }}>
                    Play
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#00BFFF',
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={() => console.log('Downloading:', item.title)}
                >
                  <Download size={12} color="#FFFFFF" />
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: '500',
                    marginLeft: 4,
                    fontFamily: 'Inter_500Medium'
                  }}>
                    Download
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 60
    }}>
      <View style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}>
        <Music size={48} color="#666666" />
        <Text style={{
          color: '#CCCCCC',
          fontSize: 18,
          fontWeight: '500',
          marginTop: 16,
          textAlign: 'center',
          fontFamily: 'Inter_500Medium'
        }}>
          No audio files yet
        </Text>
        <Text style={{
          color: '#888888',
          fontSize: 14,
          marginTop: 8,
          textAlign: 'center',
          fontFamily: 'Inter_400Regular'
        }}>
          {isAdmin ? 'Upload some audio files to get started' : 'Check back later for audio content'}
        </Text>
      </View>
    </View>
  );

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
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#FF6B6B',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Upload size={16} color="#FF6B6B" />
              <Text style={{
                color: '#FF6B6B',
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
                setSelectedAudios([]);
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
            Audio Library
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#CCCCCC',
            textAlign: 'center',
            marginTop: 4,
            fontFamily: 'Inter_400Regular'
          }}>
            Background music & sound effects
          </Text>
        </View>

        {/* Action Buttons */}
        {audioData.length > 0 && (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            paddingHorizontal: 24, 
            marginBottom: 20 
          }}>
            <TouchableOpacity
              onPress={handleDownloadAll}
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#FF6B6B',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Download size={18} color="#FF6B6B" />
              <Text style={{
                color: '#FF6B6B',
                marginLeft: 8,
                fontSize: 14,
                fontWeight: '600',
                fontFamily: 'Inter_600SemiBold'
              }}>
                Download All ({audioData.length})
              </Text>
            </TouchableOpacity>

            {isDeleteMode && selectedAudios.length > 0 && (
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
                  Delete ({selectedAudios.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Audio Grid or Empty State */}
        {audioData.length > 0 ? (
          <FlatList
            data={audioData}
            numColumns={2}
            renderItem={renderAudioItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: insets.bottom + 20
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
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
              Upload Audio
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: '#CCCCCC',
              textAlign: 'center',
              marginBottom: 24,
              fontFamily: 'Inter_400Regular'
            }}>
              Upload functionality will be implemented with file picker
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#FF6B6B',
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