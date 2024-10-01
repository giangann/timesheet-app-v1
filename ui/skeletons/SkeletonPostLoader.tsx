import React, { useRef, useEffect, memo } from "react";
import { View, StyleSheet, Animated } from "react-native";

const ShimmeringView = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) => {
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
      {props.children}
    </View>
  );
};

const RawSkeletonPostLoader = () => {
  return (
    <View style={styles.container}>
      <ShimmeringView>
        <View style={styles.header} />
      </ShimmeringView>
      <View style={styles.body}>
        <ShimmeringView>
          <View style={styles.textLine} />
        </ShimmeringView>
        <ShimmeringView>
          <View style={styles.textLine} />
        </ShimmeringView>
        <ShimmeringView>
          <View style={styles.textLine} />
        </ShimmeringView>
      </View>
      <ShimmeringView>
        <View style={styles.footer} />
      </ShimmeringView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,

    // height:'100%',
  },
  shimmerWrapper: {
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    height: "100%",
    width: "200%",
  },
  header: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  body: {
    marginTop: 16,
  },
  textLine: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    borderRadius: 4,
  },
  footer: {
    marginTop: 16,
    height: 20,
    width: "60%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export const SkeletonPostLoader = memo(RawSkeletonPostLoader);
