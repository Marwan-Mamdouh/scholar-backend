import { execFile } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Re-create __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFilePromise = util.promisify(execFile);

// Define the path to the folder where your Python code actually lives

const usersService = {
    async ParseCv(buffer: Buffer,name: string){
        const tempDir = path.join(__dirname, 'temp');
        
        // 2. Generate file name and full path inside the temp folder
        const tempFileName = `temp_${crypto.randomBytes(6).toString('hex')}_${name}`;
        const tempFilePath = path.join(tempDir, tempFileName);
        const pythonProjectDir = path.join(__dirname, 'cv_parser');
        const pythonExecutable = path.join('.venv', 'Scripts', 'python');

        try {
            // 1. Define the 'temp' directory path
            
            // 3. Ensure the 'temp' directory exists (creates it if missing)
            await fs.mkdir(tempDir, { recursive: true });

            // 4. Write the buffer to the 'temp' folder
            await fs.writeFile(tempFilePath, buffer);
            
            // 5. Execute the CLI pointing to the file inside the temp folder
            const { stdout } = await execFilePromise(
                pythonExecutable, 
                ["parse_cv.py", tempFilePath], 
                {
                    cwd: pythonProjectDir, // Python will now run inside this folder
                    env: { ...process.env },
                    // timeout:10000
                }
            );            
                
            try {
                return JSON.parse(stdout);
            } catch {
                return {
                    success: false,
                    message: "Invalid JSON output"
                };
            }

        } catch (err) {
            
            console.error('Process Error:', err.stderr || err.message);
            return {
                    success: false,
                    message: "error Happend"
                };
        }finally{
            // 7. Delete the temporary file from the temp folder when done
            await fs.unlink(tempFilePath).catch((err: Error) => {
                console.error(`Cleanup warning: Could not delete ${tempFilePath}`, err.message);
            });
        }
    }
}

export default usersService;