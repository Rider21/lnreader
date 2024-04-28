import React, { useState } from 'react';
import { isEqual } from 'lodash-es';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import Slider from './Slider.tsx';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';
import { setMMKVObject } from '@utils/mmkv/mmkv';
import {
  availableFormats,
  settings,
  WSRV_SETTINGS,
} from '@services/weserv/weserv';
import { getString } from '@strings/translations';
import { showToast } from '@utils/showToast';

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
  const [val, setVal] = useState<WSRV_SETTINGS>(settings);

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
          showToast(getString('requiresAppRestart'));
          setMMKVObject('WSRV', val);
          settings = val;
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
            <Pressable style={{ flex: 1, width: '95%' }} onPress={toggleCard}>
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
                key={key}
                title={key}
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
      {val.output === 'PNG' ? (
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
      {(val.output === 'PNG' || val.output === 'JPEG') && (
        <SettingSwitch
          value={val.progressive}
          label={
            val.output === 'JPEG'
              ? getString('wsrv.progressive.JPEG.label')
              : getString('wsrv.progressive.PNG.description')
          }
          description={
            val.output === 'JPEG'
              ? getString('wsrv.progressive.JPEG.description')
              : getString('wsrv.progressive.PNG.description')
          }
          onPress={() => setVal({ ...val, progressive: !val.progressive })}
          theme={theme}
        />
      )}
      {output === 'WEBP' && (
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
  },
});
