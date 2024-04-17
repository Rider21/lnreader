import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Share from 'react-native-share';
import color from 'color';
import { Surface, IconButton, Portal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as RNFS from 'react-native-fs';
import { Image, ImageURISource } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Chip } from '../../../../components';
import { coverPlaceholderColor } from '../../../../theme/colors';
import { DownloadFolder } from '@utils/constants/download';
import { fetchImage } from '@services/plugin/fetch';
import { showToast } from '@utils/showToast';
import { ThemeColors } from '@theme/types';
import { getString } from '@strings/translations';

interface CoverImageProps {
  children: React.ReactNode;
  source: ImageURISource;
  theme: ThemeColors;
  hideBackdrop: boolean;
}

interface NovelThumbnailProps {
  novelId: string;
  pluginId: string;
  source: ImageURISource;
  theme: ThemeColors;
  setCustomNovelCover: () => Promise<void>;
}

interface NovelTitleProps {
  theme: ThemeColors;
  children: React.ReactNode;
  onLongPress: () => void;
  onPress: () => void;
}

const NovelInfoContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.novelInfoContainer}>{children}</View>
);

const CoverImage = ({
  children,
  source,
  theme,
  hideBackdrop,
}: CoverImageProps) => {
  if (hideBackdrop) {
    return <View>{children}</View>;
  } else {
    return (
      <ImageBackground source={source} style={styles.coverImage}>
        <View
          style={{
            flex: 1,
            backgroundColor: color(theme.background).alpha(0.7).string(),
          }}
        >
          {source.uri ? (
            <LinearGradient
              colors={['rgba(0,0,0,0)', theme.background]}
              locations={[0, 1]}
              style={styles.linearGradient}
            >
              {children}
            </LinearGradient>
          ) : (
            children
          )}
        </View>
      </ImageBackground>
    );
  }
};

const NovelThumbnail = ({
  novelId,
  pluginId,
  source,
  theme,
  setCustomNovelCover,
}: NovelThumbnailProps) => {
  const [downloading, setDownloading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const bottom = useSafeAreaInsets().bottom + 10;

  if (!expanded) {
    return (
      <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
        <Image source={source} style={styles.novelThumbnail} />
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <Portal>
        <Pressable
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height + 60,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
          onPress={() => setExpanded(false)}
        >
          <Image
            source={source}
            style={{
              width: Dimensions.get('window').width,
              height: (Dimensions.get('window').width * 3) / 2,
            }}
          />
        </Pressable>
        <Surface
          theme={{ colors: { ...theme } }}
          style={{
            position: 'absolute',
            bottom,
            right: 10,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderRadius: 30,
          }}
          elevation={3}
        >
          <IconButton
            icon="share-variant-outline"
            iconColor={theme.onSurface}
            onPress={() => {
              Share.open({
                [source.uri.startsWith('file://') ? 'url' : 'message']:
                  source.uri,
              });
            }}
          />
          <IconButton
            icon="content-save-outline"
            iconColor={theme.onSurface}
            theme={{ colors: { ...theme } }}
            disabled={downloading}
            onPress={async () => {
              setDownloading(true);
              try {
                if (!(await RNFS.exists(DownloadFolder))) {
                  await RNFS.mkdir(DownloadFolder);
                }
                const filePath = DownloadFolder + '/' + novelId + '.png';
                if (source.uri.startsWith('file://')) {
                  await RNFS.copyFile(source.uri, filePath);
                } else {
                  const image = await fetchImage(pluginId, source.uri);
                  if (image) {
                    await RNFS.writeFile(filePath, image, 'base64');
                  }
                }
                showToast(getString('common.done'));
              } catch (err) {
                console.log(err);
                showToast(err.toString());
              }
              setDownloading(false);
            }}
          />
          <IconButton
            icon="pencil-outline"
            iconColor={theme.onSurface}
            onPress={setCustomNovelCover}
          />
        </Surface>
      </Portal>
    );
  }
};

const NovelTitle = ({
  theme,
  children,
  onLongPress,
  onPress,
}: NovelTitleProps) => (
  <Text
    onLongPress={onLongPress}
    onPress={onPress}
    style={[styles.novelTitle, { color: theme.onBackground }]}
    numberOfLines={4}
  >
    {children}
  </Text>
);

const NovelInfo = ({
  theme,
  children,
}: {
  theme: ThemeColors;
  children: React.ReactNode;
}) => (
  <Text
    style={[styles.novelInfo, { color: theme.onSurfaceVariant }]}
    numberOfLines={1}
  >
    {children}
  </Text>
);

const FollowButton = ({
  theme,
  onPress,
  followed,
}: {
  theme: ThemeColors;
  onPress: () => void;
  followed: boolean;
}) => (
  <View style={{ borderRadius: 4, overflow: 'hidden', flex: 1 }}>
    <Pressable
      android_ripple={{
        color: color(theme.primary).alpha(0.12).string(),
        borderless: false,
      }}
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,
      }}
    >
      <IconButton
        icon={followed ? 'heart' : 'heart-outline'}
        iconColor={followed ? theme.primary : theme.outline}
        size={24}
        style={{ margin: 0 }}
      />
      <Text
        style={{
          fontSize: 12,
          color: followed ? theme.primary : theme.outline,
        }}
      >
        {followed
          ? getString('novelScreen.inLibaray')
          : getString('novelScreen.addToLibaray')}
      </Text>
    </Pressable>
  </View>
);

const TrackerButton = ({
  theme,
  isTracked,
  onPress,
}: {
  theme: ThemeColors;
  onPress: () => void;
  isTracked: boolean;
}) => (
  <View style={{ borderRadius: 4, overflow: 'hidden', flex: 1 }}>
    <Pressable
      android_ripple={{
        color: theme.rippleColor,
        borderless: false,
      }}
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 8,
      }}
    >
      <IconButton
        icon={isTracked ? 'check' : 'sync'}
        iconColor={isTracked ? theme.primary : theme.outline}
        size={24}
        style={{ margin: 0 }}
      />
      <Text
        style={{
          fontSize: 12,
          color: isTracked ? theme.primary : theme.outline,
        }}
      >
        {isTracked
          ? getString('novelScreen.tracked')
          : getString('novelScreen.tracking')}
      </Text>
    </Pressable>
  </View>
);

const NovelGenres = ({
  theme,
  genres,
}: {
  theme: ThemeColors;
  genres: string;
}) => {
  const data = genres.split(/,\s*/);

  return (
    <FlatList
      contentContainerStyle={styles.genreContainer}
      horizontal
      data={data}
      keyExtractor={(item, index) => 'genre' + index}
      renderItem={({ item }) => <Chip label={item} theme={theme} />}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export {
  NovelInfoContainer,
  CoverImage,
  NovelThumbnail,
  NovelTitle,
  NovelInfo,
  FollowButton,
  TrackerButton,
  NovelGenres,
};

const styles = StyleSheet.create({
  novelInfoContainer: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 28,
    marginBottom: 0,
    paddingTop: 90,
  },
  coverImage: {},
  linearGradient: {
    flex: 1,
  },
  novelThumbnail: {
    height: 150,
    width: 100,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: coverPlaceholderColor,
  },
  novelTitle: {
    fontSize: 20,
  },
  novelInfo: {
    fontSize: 14,
  },
  followButton: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    paddingLeft: 4,
    borderWidth: 0,
    elevation: 0,
  },
  genreContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  genreChip: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    fontSize: 12,
    borderRadius: 50,
    textTransform: 'capitalize',
  },
});
