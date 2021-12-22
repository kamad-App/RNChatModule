
import ImagePicker from 'react-native-image-crop-picker';

export const launchCamera = (isCrop, callback) => {
  const options = {
    width: 1024,
    height: 1024,
    compressImageMaxWidth: 1024,
    compressImageMaxHeight: 1024,
    avoidEmptySpaceAroundImage: true,
    cropping: isCrop,
    cropperCircleOverlay: isCrop,
    mediaType: 'photo',
  };
  ImagePicker.openCamera(options)
    .then((image) => {
      callback(image);
    })
    .catch((err) => {
      Alert.alert(err.message);
    });
};

export const openPhotoGallery = (isCrop, callback) => {
  const options = {
    width: 1024,
    height: 1024,
    compressImageMaxWidth: 1024,
    compressImageMaxHeight: 1024,
    avoidEmptySpaceAroundImage: true,
    cropping: isCrop,
    cropperCircleOverlay: isCrop,
    mediaType: 'photo',
  };
  ImagePicker.openPicker(options)
    .then((image) => {
      callback(image);
    })
    .catch(() => {});
};
