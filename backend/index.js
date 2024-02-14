// server.mjs
import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

app.post('/run-ml-algo', async (req, res) => {
    console.log("P1");
    const pythonScriptPath = 'ml_algo/chatbot.py';

    try {
        // Install dependencies
        console.log("P2");
        await installDependencies();

        console.log("P2.1");

        // Run the Python script asynchronously
        const pythonProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.11/bin/python3', [pythonScriptPath]);

        // Handle Python process events
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python script output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error running Python script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            if (code === 0) {
                res.json({ success: true, message: 'ML algorithm executed successfully' });
            } else {
                res.status(500).json({ success: false, message: 'Error running ML algorithm' });
            }
        });

    } catch (error) {
        console.error(`Error running Python script: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.on('error', (error) => {
    console.error('Error starting the server:', error.message);
});

async function installDependencies() {
    return new Promise((resolve, reject) => {
        // const installProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.11/bin/python3', ['-m', 'pip', 'install', 'mediapipe', 'opencv-python', '']);
        const installProcess = spawn('/Library/Frameworks/Python.framework/Versions/3.11/bin/python3', [
            '-m', 'pip', 'install', 'panel', 'openai', 'opencv-python', 'Flask', 'Flask-CORS'
          ]);
          
        let installOutput = '';

        // Capture stdout to include in the error message
        installProcess.stdout.on('data', (data) => {
            installOutput += data;
        });

        installProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Dependencies installed successfully');
                resolve();
            } else {
                console.error(`Error installing dependencies. Output: ${installOutput}`);
                reject(new Error(`Error installing dependencies. Output: ${installOutput}`));
            }
        });
    });
}
