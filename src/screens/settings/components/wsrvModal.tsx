import * as React from 'react';
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import Slider from '@react-native-community/slider';
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
  const { width: screenWidth } = useWindowDimensions();

  const [type = availableFormats[0], setType] = useMMKVString('WSRV_TYPE');
  const [compression = '6', setCompression] = useMMKVString(
    'WSRV_COMPRESSION_LEVEL',
  );
  const compressionProgress = parseInt(compression, 10);

  const [quality = '80', setQuality] = useMMKVString('WSRV_QUALITY');
  const qualityProgress = parseInt(quality, 10);

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

      <View style={styles.pickerContainer}>
        <Menu
          style={{ flex: 1 }}
          visible={isVisible}
          contentStyle={{ backgroundColor: theme.surfaceVariant }}
          anchor={
            <Pressable
              style={{ flex: 1, width: screenWidth - 48 }}
              onPress={toggleCard}
            >
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
                    {` Format image `}
                  </Text>
                }
                value={value || 'whatever'}
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
                key={val}
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
      </View>
      {type === 'png' ? (
        <>
          <Text style={styles.label}>The zlib compression level</Text>
          <Slider
            value={compressionProgress}
            minimumValue={0}
            maximumValue={9}
            step={1}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={'#000000'}
            thumbTintColor={theme.primary}
            onSlidingComplete={value => setCompression(value.toString())}
          />
          <SettingSwitch
            label="Adaptive filter"
            value={adaptiveFilter}
            description="Use adaptive row filtering for reducing the PNG file size."
            onPress={() => setAdaptiveFilter(prevVal => !prevVal)}
            theme={theme}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Defines the quality of the image.</Text>
          <Slider
            value={qualityProgress}
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={'#000000'}
            thumbTintColor={theme.primary}
            onSlidingComplete={value => setQuality(value.toString())}
            disable={losslessCompression}
          />
        </>
      )}
      {(type === 'png' || type === 'jpg') && (
        <SettingSwitch
          label="Progressive"
          description="Adds interlacing PNG. JPEGs become progressive."
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
    flex: 1,
    margin: 30,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 32,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});
