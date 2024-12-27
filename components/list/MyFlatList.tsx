import { useState } from "react";
import { FlatList } from "react-native";
import type { FlatListProps } from "react-native";

type Props<T> = Omit<FlatListProps<T>, "refreshing" | "onRefresh"> & {
  onPullDown: () => Promise<void> | void;
};

export const MyFlatListRefreshable = <T,>({
  onPullDown,
  ...flatListProps
}: Props<T>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await onPullDown();
    setRefreshing(false);
  };

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      {...flatListProps}
    />
  );
};
