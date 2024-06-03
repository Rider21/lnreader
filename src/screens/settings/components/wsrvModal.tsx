import React from 'react';
import { assign, isEqual } from 'lodash-es';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import Slider from './Slider.tsx';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';
import { useMMKVObject } from 'react-native-mmkv';
import {
  availableFormats,
  settings,
  WSRV_SETTINGS,
} from '@services/weserv/weserv';
import { getString } from '@strings/translations';

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
  const [val = settings, setVal] = useMMKVObject<WSRV_SETTINGS>('WSRV');

  const {
    value: isVisible,
    toggle: toggleCard,
    setFalse: closeCard,
  } = useBoolean();

  return (
    <Modal
      visible={displayModalVisible}
      style={{ flex: 1 }}
      onDismiss={() => {
        if (!isEqual(settings, val)) {
          assign(settings, val);
        }
        closeModal();
      }}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: overlay(2, theme.surface) },
      ]}
    >
      <SettingSwitch
        label="WSRV"
        value={val.status}
        onPress={() => setVal({ ...val, status: !val.status })}
        theme={theme}
      />

      <View style={styles.pickerContainer}>
        <Menu
          style={{ flex: 1 }}
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
                    {` Format image `}
                  </Text>
                }
                value={val.output}
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
          {availableFormats.map(key => {
            return (
              <Menu.Item
                title={key.toUpperCase()}
                titleStyle={{ color: theme.onSurfaceVariant }}
                onPress={() => {
                  setVal({ ...val, output: key });
                  closeCard();
                }}
              />
            );
          })}
        </Menu>
      </View>
      {val.output === 'png' ? (
        <>
          <Slider
            value={val.compressionLevel}
            label={getString('wsrv.compress.label')}
            description={getString('wsrv.compress.description')}
            onSlidingComplete={value =>
              setVal({ ...val, compressionLevel: value })
            }
            area={[0, 9]}
            theme={theme}
          />
          <SettingSwitch
            value={val.adaptiveFilter}
            label={getString('wsrv.adaptiveFilter.label')}
            description={getString('wsrv.adaptiveFilter.description')}
            onPress={() =>
              setVal({ ...val, adaptiveFilter: !val.adaptiveFilter })
            }
            theme={theme}
          />
        </>
      ) : (
        <Slider
          value={val.quality}
          label={getString('wsrv.quality.label')}
          description={getString('wsrv.quality.description')}
          onSlidingComplete={value => setVal({ ...val, quality: value })}
          area={[1, 100]}
          theme={theme}
          disabled={val.lossless}
        />
      )}
      {(val.output === 'png' || val.output === 'jpg') && (
        <SettingSwitch
          value={val.progressive}
          label={
            val.output === 'jpg'
              ? getString('wsrv.progressive.jpg.label')
              : getString('wsrv.progressive.png.label')
          }
          description={
            val.output === 'jpg'
              ? getString('wsrv.progressive.jpg.description')
              : getString('wsrv.progressive.png.description')
          }
          onPress={() => setVal({ ...val, progressive: !val.progressive })}
          theme={theme}
        />
      )}
      {val.output === 'webp' && (
        <SettingSwitch
          value={val.lossless}
          label={getString('wsrv.lossless.label')}
          description={getString('wsrv.lossless.description')}
          onPress={() => setVal({ ...val, lossless: !val.lossless })}
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
