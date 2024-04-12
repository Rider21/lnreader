import { DownloadDirectoryPath, ExternalDirectoryPath } from 'react-native-fs';

export const AppDownloadFolder = ExternalDirectoryPath;

export const NovelDownloadFolder = AppDownloadFolder + '/Novels';

export const PluginDownloadFolder = AppDownloadFolder + '/Plugins';

export const DownloadFolder = DownloadDirectoryPath + '/LNReader';
