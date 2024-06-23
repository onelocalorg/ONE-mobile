import React, { useState } from "react";
import {
  FlatList,
  FlatListProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "~/app-hooks/use-app-theme";
import { useStringsAndLabels } from "~/app-hooks/use-strings-and-labels";
import { Loader } from "~/components/loader";

import { createStyleSheet } from "./style";

type ComponentType = "flatList" | "scrollView";

export interface EmptyComponentData {
  title?: string;
}

export interface ListProps<ItemT> extends FlatListProps<ItemT> {
  componentType?: ComponentType;
  keyExtractor?: (item: ItemT, index: number) => string;
  onRefresh?: () => Promise<void>;
  children?: React.ReactNode;
  dataLength?: number;
  count?: number;
  limit?: number;
  onLoadMoreData?: () => void;
  enablePagination?: boolean;
  emptyComponentData?: EmptyComponentData;
  emptyViewStyle?: StyleProp<ViewStyle>;
  totalPages?: number;
  currentPage?: number;
}

export function FlatListComponent<ItemT>(props: ListProps<ItemT>) {
  const {
    componentType = "flatList",
    keyExtractor = (item: ItemT, index: number) => index.toString(),
    dataLength = 10,
    onLoadMoreData,
    enablePagination = false,
    emptyComponentData,
    emptyViewStyle,
    totalPages = 1,
    currentPage = 1,
    ...remainingProps
  } = props;
  const { theme } = useAppTheme();
  const styles = createStyleSheet(theme);
  const { strings: stringsAndLabels } = useStringsAndLabels();
  const [paginationLoader, setPaginationLoader] = useState(false);
  const { title } = emptyComponentData || {};

  const listFooterComponent = () => {
    const endReached = totalPages <= currentPage;

    if (!endReached) {
      return <Loader paginationLoader visible={paginationLoader} />;
    }

    return <Text style={styles.text}>{stringsAndLabels.noDataText}</Text>;
  };

  const onEndReached = () => {
    setPaginationLoader(true);
    onLoadMoreData?.();
    setTimeout(() => {
      setPaginationLoader(false);
    }, 700);
  };

  const listEmptyComponent = () => (
    <View style={[styles.emptyView, emptyViewStyle]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  if (componentType === "flatList") {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        onEndReached={() => {
          if (totalPages > currentPage && enablePagination) {
            onEndReached();
          }
        }}
        ListFooterComponent={
          enablePagination && dataLength > 0 ? listFooterComponent() : <></>
        }
        onEndReachedThreshold={0.01}
        ListEmptyComponent={title ? listEmptyComponent() : <></>}
        {...remainingProps}
      />
    );
  }
  return null;
}
