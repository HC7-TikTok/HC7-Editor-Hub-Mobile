import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Users, UserCheck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [keyError, setKeyError] = useState('');
  
  // Animation values
  const hc7Scale = useRef(new Animated.Value(1)).current;
  const visitorScale = useRef(new Animated.Value(1)).current;
  const gradientShift = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  // Background gradient animation
  useEffect(() => {
    const animateGradient = () => {
      Animated.sequence([
        Animated.timing(gradientShift, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientShift, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        })
      ]).start(() => animateGradient());
    };
    animateGradient();
  }, []);

  const handleCardPress = (scale, isHC7 = false) => {
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
      })
    ]).start();

    if (isHC7) {
      setModalVisible(true);
      setAdminKey('');
      setKeyError('');
    } else {
      // Navigate to main menu as visitor
      router.push('/menu?userType=visitor');
    }
  };

  const handleCardPressIn = (scale) => {
    Animated.timing(scale, {
      toValue: 1.05,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = (scale) => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const validateAdminKey = () => {
    const correctKey = '11ojd-yy63n-9232n';
    if (adminKey === correctKey) {
      setModalVisible(false);
      router.push('/menu?userType=hc7');
    } else {
      setKeyError('Invalid key, please try again.');
      // Shake animation
      Animated.sequence([
        Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const gradientColors = gradientShift.interpolate({
    inputRange: [0, 1],
    outputRange: [
      ['#121212', '#1a1a1a', '#0d1421'],
      ['#0d1421', '#121212', '#1a1a1a']
    ]
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: insets.top }}>
      <StatusBar style="light" />
      
      {/* Animated Background */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <LinearGradient
          colors={['#121212', '#1a1a1a', '#0d1421']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Subtle particles effect */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        opacity: 0.1
      }}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 2,
              height: 2,
              backgroundColor: '#00BFFF',
              borderRadius: 1,
              left: Math.random() * width,
              top: Math.random() * height,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 24
      }}>
        {/* Title */}
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 20,
          fontFamily: 'Inter_600SemiBold'
        }}>
          HC7 TikTok Editing Hub
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#CCCCCC',
          textAlign: 'center',
          marginBottom: 60,
          fontFamily: 'Inter_400Regular'
        }}>
          Choose your access level to continue
        </Text>

        {/* Cards Container */}
        <View style={{ 
          flexDirection: width > 600 ? 'row' : 'column',
          gap: 24,
          width: '100%',
          maxWidth: 600
        }}>
          {/* HC7 Card */}
          <Animated.View style={{ 
            transform: [{ scale: hc7Scale }],
            flex: 1
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 20,
                padding: 32,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#00BFFF',
                minHeight: 180,
                justifyContent: 'center',
                shadowColor: '#00BFFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 10
              }}
              onPress={() => handleCardPress(hc7Scale, true)}
              onPressIn={() => handleCardPressIn(hc7Scale)}
              onPressOut={() => handleCardPressOut(hc7Scale)}
              activeOpacity={0.8}
            >
              <View style={{
                backgroundColor: 'rgba(0, 191, 255, 0.1)',
                padding: 16,
                borderRadius: 12,
                marginBottom: 16
              }}>
                <UserCheck size={32} color="#00BFFF" />
              </View>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: 8,
                fontFamily: 'Inter_600SemiBold'
              }}>
                HC7
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#CCCCCC',
                textAlign: 'center',
                fontFamily: 'Inter_400Regular'
              }}>
                Admin Access
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Visitor Card */}
          <Animated.View style={{ 
            transform: [{ scale: visitorScale }],
            flex: 1
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 20,
                padding: 32,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                minHeight: 180,
                justifyContent: 'center',
                shadowColor: '#FFFFFF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5
              }}
              onPress={() => handleCardPress(visitorScale)}
              onPressIn={() => handleCardPressIn(visitorScale)}
              onPressOut={() => handleCardPressOut(visitorScale)}
              activeOpacity={0.8}
            >
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: 16,
                borderRadius: 12,
                marginBottom: 16
              }}>
                <Users size={32} color="#FFFFFF" />
              </View>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: 8,
                fontFamily: 'Inter_600SemiBold'
              }}>
                Visitor
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#CCCCCC',
                textAlign: 'center',
                fontFamily: 'Inter_400Regular'
              }}>
                Guest Access
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Admin Key Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24
        }}>
          <Animated.View style={{
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            transform: [{ translateX: errorShake }]
          }}>
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: 8,
              fontFamily: 'Inter_600SemiBold'
            }}>
              Admin Access
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: '#CCCCCC',
              textAlign: 'center',
              marginBottom: 24,
              fontFamily: 'Inter_400Regular'
            }}>
              Enter the admin key to continue
            </Text>

            <TextInput
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 16,
                color: '#FFFFFF',
                fontSize: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: keyError ? '#FF4444' : 'rgba(255, 255, 255, 0.2)',
                fontFamily: 'Inter_400Regular'
              }}
              placeholder="Enter admin key"
              placeholderTextColor="#888888"
              value={adminKey}
              onChangeText={(text) => {
                setAdminKey(text);
                if (keyError) setKeyError('');
              }}
              secureTextEntry
              autoCapitalize="none"
            />

            {keyError ? (
              <Text style={{
                color: '#FF4444',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 16,
                fontFamily: 'Inter_400Regular'
              }}>
                {keyError}
              </Text>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center'
                }}
                onPress={() => {
                  setModalVisible(false);
                  setAdminKey('');
                  setKeyError('');
                }}
              >
                <Text style={{
                  color: '#CCCCCC',
                  fontSize: 16,
                  fontWeight: '500',
                  fontFamily: 'Inter_500Medium'
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#00BFFF',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center'
                }}
                onPress={validateAdminKey}
              >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold'
                }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}