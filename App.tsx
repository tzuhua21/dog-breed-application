import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, PermissionsAndroid, StyleSheet } from 'react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import ImageViewing from 'react-native-image-viewing';
import { BlurView } from '@react-native-community/blur';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import AWS from 'aws-sdk';
var ImagePicker = require('react-native-image-picker');

AWS.config.update({
  region: 'setting_region',
  accessKeyId: 'setting_accessKeyID',
  secretAccessKey: 'setting_accessKey',
});


const s3 = new AWS.S3();
const lambda = new AWS.Lambda();
const weather_API_KEY = 'weather_API';


const App = () => {

  const [imageUri, setImageUri] = useState('');
  const [blurredImageUri, setBlurredImageUri] = useState('');
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [dogBreed, setDogBreed] = useState('');
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState('');

  // Request permissions when the app is loaded
  useEffect(() => {
    requestCameraPermission();
    requestGalleryPermission();
    requestLocationPermission();
  }, []);


  const uploadToS3 = async (fileUri) => {
    const file = await fetch(fileUri);
    const blob = await file.blob();

    const params = {
      Bucket: '523finalnew',
      Key: 'dog.jpg', // you can change 
      Body: blob,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error uploading image: ', err);
      } else {
        console.log('Successfully uploaded image!');
        triggerLambda();
      }
    });
  };


  const triggerLambda = () => {
    const params = {
      FunctionName: '523finalpython', //It should align with the name of your AWS Lambda function
      InvocationType: 'RequestResponse',
    };
  
    lambda.invoke(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log('Lambda invoked successfully: ', data);
        const lambdaOutput = JSON.parse(data.Payload);
        // const dogBreed = lambdaOutput.body || 'Unknown'; // add JSON parsing to get the correct data
        const dogBreed = JSON.parse(data.Payload);
        setDogBreed(dogBreed);
        console.log('suc');
      }
    });
  };
  

  // Request gallery permission function
  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your local gallery',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Gallery permission granted');
      } else {
        console.log('Gallery permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Request camera permission function
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Request location permission function
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        Geolocation.getCurrentPosition(
          position => {
            setLocation(`${position.coords.latitude},${position.coords.longitude}`);
          },
          error => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    // Save photo function
    const savePhoto = async () => {
      try {
        await CameraRoll.save(blurredImageUri || imageUri, { type: 'photo' });
        console.log('Photo saved to camera roll');
      } catch (error) {
        console.log('An error occurred while saving the photo', error);
      }
    };

    // Take photo function
    const takePhoto = async () => {
      ImagePicker.launchCamera({ title: 'Take a Photo' }, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          setImageUri(response.assets[0].uri);
          setDogBreed('');
        }
      });
    };
  
    // Blur image function
    const blurImage = async () => {
      setBlurredImageUri(imageUri);
      setImageUri('');
      setDogBreed('');
    };
  
    // Undo blur function
    const undoBlur = async () => {
      setImageUri(blurredImageUri);
      setBlurredImageUri('');
      setDogBreed('');
    };
  
    // Open image library function
    const openImageLibrary = async () => {
      ImagePicker.launchImageLibrary({ title: 'Select a Photo' }, (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          setImageUri(response.assets[0].uri);
          setDogBreed('');
        }
      });
    };
  

    const recognizeDogBreed = async () => {
      uploadToS3(imageUri);
    
    };
  

  
  // Get weather function
  const getWeather = async () => {
    const [latitude, longitude] = location.split(',');

    axios({
      method: 'get',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weather_API_KEY}`,
    })
      .then(async (response) => {
        const weatherDescription = `${response.data.name}, ${response.data.weather[0].description}, ${Math.round(response.data.main.temp - 273.15)}°C`;
        setWeather(weatherDescription);

       });
  };
  
    // Custom button component
    const CustomButton = ({ title, onPress }) => (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Text style={styles.customButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {imageUri !== '' && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text>{weather}</Text>
          <Text>{dogBreed}</Text>
        </>
      )}
      {blurredImageUri !== '' && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: blurredImageUri }} style={styles.image} />
          <BlurView style={styles.blur} blurType="light" blurAmount={30} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <CustomButton title="Take a Photo" onPress={takePhoto} />
          <CustomButton title="Open Gallery" onPress={openImageLibrary} />
        </View>
        <View style={styles.buttonRow}>
          <CustomButton title="Blur Picture" onPress={blurImage} />
          <CustomButton title="Undo Blur" onPress={undoBlur} />
        </View>
        <View style={styles.buttonRow}>
          <CustomButton title="Recognize Dog Breed" onPress={recognizeDogBreed} />
          <CustomButton title="Get Weather" onPress={getWeather} />
          <CustomButton title="Save photo" onPress={savePhoto} />
        </View>
      </View>
      {isImageViewVisible && (
        <ImageViewing
          images={[{ uri: imageUri }]}
          imageIndex={0}
          presentationStyle="overFullScreen"
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
        />
      )}
    </View>
  );
};
// Set the UI for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  imageContainer: {
    position: 'relative',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
  },
  buttonContainer: {
    paddingBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  customButton: {
    backgroundColor: 'gold',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  customButtonText: {
    color: 'purple',
    fontWeight: 'bold',
  },
});

export default App;