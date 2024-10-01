import React, { useRef, useEffect, memo } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

const ShimmeringView = () => {
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 100,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateX]);

  return (
    <View style={styles.shimmerWrapper}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

type Props = {
  height?: number;
  overrideContainerStyles?: ViewStyle;
};
const RawSkeletonRectangleLoader: React.FC<Props> = ({ height, overrideContainerStyles }) => {
  return (
    <View style={[styles.container, height ? { height: height } : {}, overrideContainerStyles ?? {}]}>
      <ShimmeringView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: "200%",
  },
});

export const SkeletonRectangleLoader = memo(RawSkeletonRectangleLoader) as typeof RawSkeletonRectangleLoader;
