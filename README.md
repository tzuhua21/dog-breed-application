# Dog Breed application readme


> 
>  demo video: 
>  ![image](https://github.com/tzuhua21/dog-breed-application/blob/main/EEP_523_final_project_demo_video.gif)
[video link](https://www.youtube.com/shorts/WuMek0aybwg)

## Implementation

Ref: [Setting up the development environment](https://reactnative.dev/docs/environment-setup?guide=native)
1. Create project
```
npx react-native@latest init {project_name}
```

2. Start metro
```
npm start
```

3. Change the code from app.tsx

4. Start your application
```
npm run android
```

## Dependencies
This app requires the following dependencies:

The following dependencies are required for this app to run:

* React

* AWS S3

* AWS Lambda

* AWS Rekognition

* React Native components such as View, Text, TextInput, TouchableOpacity, and StyleSheet

* ImagePicker for launching the camera and choosing image from device.

* Geolocation from react-native-geolocation-service for accessing the device's GPS data

* axios for making API calls to the OpenWeatherMap API

* PermissionsAndroid from React Native for requesting permissions on Android devices


## APP Usage:

The app provides the following features:

* Image Capture and Selection: The application allows users to take photos or select images from their device's gallery. It integrates with the device's camera and image library using the react-native-image-picker library.

*  Image Processing and Recognition: The captured or selected images are processed using image recognition algorithms. The application uploads the images to an AWS S3 bucket and triggers an AWS Lambda function (523finalpython) for breed recognition. The AWS SDK is utilized for S3 integration (aws-sdk) and invoking the Lambda function.

*  User Interface: The application provides an intuitive and visually appealing user interface. It includes features like buttons for capturing/selecting images, options for blurring and undoing image blur, recognizing dog breeds, retrieving weather information, and saving photos. The UI components are implemented using React Native's View, TouchableOpacity, Text, and Image

* The user can enter a city name to get the current weather information for that city.

##### On Android devices, the app requests permission to access the device's GPS data to get the current location's weather information.



## Ref
1. [AWS Lambda Deployment Package in Python](https://www.youtube.com/watch?v=rDbxCeTzw_k&feature=youtu.be)
1. [How to Use Amazon Rekognition for Facial Recognition and Analysis](https://www.youtube.com/watch?v=3PGPfs-ARdo)
1. [OpenWeatherMap API Documentation](https://openweathermap.org/api)
