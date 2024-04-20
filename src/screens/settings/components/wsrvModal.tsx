import * as React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import Slider from './Slider.tsx';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';
import { getString } from '@strings/translations';

const availableFormats: string[] = ['JPEG', 'PNG', 'TIFF', 'WEBP'];

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
  const compressionProgress = parseInt(compression, 10);

  const [quality = '80', setQuality] = useMMKVString('WSRV_QUALITY');
  const qualityProgress = parseInt(quality, 10);

  const [status = false, setStatus] = useMMKVBoolean('WSRV_STATUS');

  const [adaptiveFilter = false, setAdaptiveFilter] = useMMKVBoolean(
    'WSRV_ADAPTIVE_FILTER',
  );

  const [progressive = false, setProgressive] =
    useMMKVBoolean('WSRV_PROGRESSIVE');
  const [lossless = false, setLossless] = useMMKVBoolean(
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
            <Pressable style={{ flex: 1, width: '90%' }} onPress={toggleCard}>
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
      {type === 'PNG' ? (
        <>
          <Slider
            value={compressionProgress}
            label={getString('wsrv.compress.label')}
            description={getString('wsrv.compress.description')}
            onSlidingComplete={value => setCompression(value.toString())}
            area={[0, 9]}
            theme={theme}
          />
          <SettingSwitch
            value={adaptiveFilter}
            label={getString('wsrv.adaptiveFilter.label')}
            description={getString('wsrv.adaptiveFilter.description')}
            onPress={() => setAdaptiveFilter(prevVal => !prevVal)}
            theme={theme}
          />
        </>
      ) : (
        <Slider
          value={qualityProgress}
          label={getString('wsrv.quality.label')}
          description={getString('wsrv.quality.description')}
          onSlidingComplete={value => setQuality(value.toString())}
          area={[1, 100]}
          theme={theme}
          disabled={lossless}
        />
      )}
      {(type === 'PNG' || type === 'JPEG') && (
        <SettingSwitch
          value={progressive}
          label={getString(`wsrv.progressive.${type}.label`)}
          description={getString(`wsrv.progressive.${type}.description`)}
          onPress={() => setProgressive(prevVal => !prevVal)}
          theme={theme}
        />
      )}
      {type === 'WEBP' && (
        <SettingSwitch
          value={lossless}
          label={getString('wsrv.lossless.label')}
          description={getString('wsrv.lossless.description')}
          onPress={() => setLossless(prevVal => !prevVal)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
  },
});
