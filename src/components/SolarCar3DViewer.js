import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import {
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  Color,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
} from 'three';

const { width } = Dimensions.get('window');

const SolarCar3DViewer = ({ telemetryData }) => {
  const [modelExists, setModelExists] = useState(false);
  const [modelError, setModelError] = useState(null);
  const rotation = new Animated.Value(0);
  const pulse = new Animated.Value(1);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const carModelRef = useRef(null);

  const onContextCreate = async (gl) => {
    try {
      // Set up the 3D scene
      const scene = new Scene();
      scene.background = new Color(0x000000);
      sceneRef.current = scene;

      // Set up camera
      const camera = new PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Set up renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      rendererRef.current = renderer;

      // Set up lighting
      const ambientLight = new AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Create placeholder 3D car model
      const geometry = new BoxGeometry(2, 0.5, 4);
      const material = new MeshLambertMaterial({ color: 0xC9302C });
      const placeholderModel = new Mesh(geometry, material);
      placeholderModel.position.set(0, 0, 0);
      scene.add(placeholderModel);
      carModelRef.current = placeholderModel;
      
      // Set model as loaded
      setModelExists(true);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate the car model if it exists
        if (carModelRef.current) {
          carModelRef.current.rotation.y += 0.01;
          
          // Pulse based on battery level
          const batteryLevel = telemetryData?.soc || 50;
          const pulseIntensity = 1 + (100 - batteryLevel) * 0.002;
          carModelRef.current.scale.setScalar(pulseIntensity);
        }
        
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      
      animate();
    } catch (error) {
      console.error('3D context creation error:', error);
      setModelError(error.message);
      setModelExists(false);
    }
  };

  useEffect(() => {
    // Model will be created in the 3D context, so no need to check here
    
    // Start rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

    // Start pulse animation based on battery level
    const batteryLevel = telemetryData?.soc || 50;
    const pulseSpeed = 1000 + (100 - batteryLevel) * 20; // Faster pulse when battery is low
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [telemetryData?.soc]);

  const batteryLevel = telemetryData?.soc || 50;

  const rotationInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.blur}>
        <View style={styles.content}>
          {/* 3D Model Container */}
          <View style={styles.modelContainer}>
            {modelError ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={40} color="#EF4444" />
                <Text style={styles.errorText}>3D Model Error</Text>
                <Text style={styles.errorSubtext}>{modelError}</Text>
              </View>
            ) : (
              <View style={styles.glContainer}>
                <GLView
                  style={styles.glView}
                  onContextCreate={onContextCreate}
                />
              </View>
            )}
          </View>

          {/* 3D Ready Indicator */}
          <View style={styles.readyIndicator}>
            <Ionicons 
              name={modelExists ? "checkmark-circle" : modelError ? "alert-circle" : "cube"} 
              size={16} 
              color="white" 
            />
            <Text style={styles.readyText}>
              {modelExists ? "3D Loaded" : modelError ? "3D Error" : "3D Ready"}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 15,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  errorSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  glView: {
    flex: 1,
    width: '100%',
  },
  glContainer: {
    flex: 1,
    position: 'relative',
  },
  readyIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C9302C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SolarCar3DViewer;
