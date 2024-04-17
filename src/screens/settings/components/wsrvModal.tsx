import * as React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';

const availableFormats: string[] = ['jpg', 'png', 'tiff', 'webp'];

interface wsrvProps {
  theme: ThemeColors;
  displayModalVisible: boolean;
  setDisplayModal: () => void;
}

const WSRV: React.FC<wsrvProps> = ({
  theme,
  displayModalVisible,
  closeModal,
}) => {
  const [type = availableFormats[0], setType] = useMMKVString('WSRV_TYPE');
  const [compression = '6', setCompression] = useMMKVString(
    'WSRV_COMPRESSION_LEVEL',
  );
  const compressionProgress = useSharedValue(parseInt(compression, 10));

  const [quality = '80', setQuality] = useMMKVString('WSRV_QUALITY');
  const qualityProgress = useSharedValue(parseInt(quality, 10));

  const [status = false, setStatus] = useMMKVBoolean('WSRV_STATUS');

  const [adaptiveFilter = false, setAdaptiveFilter] = useMMKVBoolean(
    'WSRV_ADAPTIVE_FILTER',
  );
  const [progressive = false, setProgressive] =
    useMMKVBoolean('WSRV_PROGRESSIVE');
  const [losslessCompression = false, setLosslessCompression] = useMMKVBoolean(
    'WSRV_LOSSLESS_COMPRESSION',
  );

  const {
    value: isVisible,
    toggle: toggleCard,
    setFalse: closeCard,
  } = useBoolean();

  return (
    <Modal
      visible={displayModalVisible}
      onDismiss={closeModal}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: overlay(2, theme.surface) },
      ]}
    >
      <SettingSwitch
        label="WSRV"
        value={status}
        onPress={() => setStatus(prevVal => !prevVal)}
        theme={theme}
      />

      <Menu
        visible={isVisible}
        contentStyle={{ backgroundColor: theme.surfaceVariant }}
        anchor={
          <Pressable style={{ flex: 1 }} onPress={toggleCard}>
            <TextInput
              mode="outlined"
              label={
                <Text
                  style={[
                    styles.label,
                    {
                      color: isVisible ? theme.primary : theme.onSurface,
                      backgroundColor: theme.surface,
                    },
                  ]}
                >
                  {` ${type} 1`}
                </Text>
              }
              value={type || 'whatever'}
              editable={false}
              theme={{ colors: { background: 'transparent' } }}
              outlineColor={isVisible ? theme.primary : theme.onSurface}
              textColor={isVisible ? theme.primary : theme.onSurface}
              right={
                <TextInput.Icon
                  icon={isVisible ? 'chevron-up' : 'chevron-down'}
                  color={isVisible ? theme.primary : theme.onSurface}
                />
              }
            />
          </Pressable>
        }
        onDismiss={closeCard}
      >
        {availableFormats.map(val => {
          return (
            <Menu.Item
              title={val}
              titleStyle={{ color: theme.onSurfaceVariant }}
              onPress={() => {
                setType(val);
                closeCard();
              }}
            />
          );
        })}
      </Menu>
      {type === 'png' ? (
        <>
          <View style={[styles.card]}>
            <Text style={styles.label}>The zlib compression level</Text>
            <Slider
              progress={compressionProgress}
              onSlidingComplete={num => setCompression(num)}
              minimumValue={useSharedValue(0)}
              maximumValue={useSharedValue(9)}
            />
          </View>
          <SettingSwitch
            label="Adaptive filter"
            value={adaptiveFilter}
            description="Use adaptive row filtering for reducing the PNG file size."
            onPress={() => setAdaptiveFilter(prevVal => !prevVal)}
            theme={theme}
          />
        </>
      ) : (
        <View style={[styles.card]}>
          <Text style={styles.label}>Defines the quality of the image.</Text>
          <Slider
            progress={qualityProgress}
            onSlidingComplete={num => setQuality(num)}
            minimumValue={useSharedValue(1)}
            maximumValue={useSharedValue(100)}
            disable={losslessCompression}
          />
        </View>
      )}
      {(type === 'png' || type === 'jpg') && (
        <SettingSwitch
          label="Progressive"
          value={progressive}
          onPress={() => setProgressive(prevVal => !prevVal)}
          theme={theme}
        />
      )}
      {type === 'webp' && (
        <SettingSwitch
          label="Lossless compression"
          description="Whether the resulting image should be lossless compressed."
          value={losslessCompression}
          onPress={() => setLosslessCompression(prevVal => !prevVal)}
          theme={theme}
        />
      )}
    </Modal>
  );
};

export default WSRV;

const styles = StyleSheet.create({
  modalContainer: {
    margin: 30,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 32,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    marginTop: 20,
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    elevation: 1,
  },
});
