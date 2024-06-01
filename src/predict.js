const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define the handler function
const predictFromModel = async (imagePath) => {
    try {
        // DEV MODE
        const imageBuffer = fs.readFileSync(imagePath);
        console.log("MASUK1")
        const modelPath = path.resolve(__dirname, 'model/old model/model.json');
        console.log("MASUK2")
        const model = await tf.loadLayersModel('file://' + modelPath);
        console.log("MASUK3")
        // PRODUCTION
        // const model = await tf.loadLayersModel(process.env.MODEL_URL);
        // const imageBuffer = fs.readFileSync(imagePath);

        const tensor = tf.node
        .decodeJpeg(imageBuffer)
        .resizeNearestNeighbor([150, 150])
        .expandDims()
        .toFloat()

        const prediction = model.predict(tensor);
        // const score = await prediction.data();

        return prediction;
    } catch (error) {
        console.error('Error predicting:', error);
        throw error;
    }
};

module.exports = predictFromModel;
