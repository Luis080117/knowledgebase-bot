Install a Python virtual environment, preferably using Anaconda (https://www.anaconda.com/download).
Create a virtual environment: conda create -n llama_index python=3.11.
Activate the virtual environment: conda activate llama_index.
Install dependencies: pip install -r requirements.txt.
Run the backend service and API sequentially:

python index_server.py
python flask_demo.py
Compile the React frontend code:
cd react_frontend
npm install
npm run build
The compiled code is in the build folder. You can open index.html directly in a browser to view the results or deploy it to an IIS server.
Debug the frontend:
npm start
Deployment to Server:
Install a Python virtual environment, preferably using Anaconda (https://www.anaconda.com/download).
Create a virtual environment: conda create -n llama_index python=3.11.
Activate the virtual environment: conda activate llama_index.
Install dependencies: pip install -r requirements.txt.
Install Chocolatey (https://chocolatey.org/install) to install NSSM. Run the following in PowerShell as an administrator:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
Configuration to modify (to deploy multiple versions on the same machine, use different ports):
In index_server.py:
manager = BaseManager(('', 3002), b'password')
In flask_demo.py:
manager = BaseManager(('127.0.0.1', 3002), b'password')
serve(app, host="0.0.0.0", port=3001)
Modify the compiled code in:
Website\static\js\main.xxx.js
Search for API_URL and change it to the correct address.
It can also be modified before compilation in:
KnowledgeBase\react_frontend\src\authConfig.js
KnowledgeBase\react_frontend\src\apis\config.ts
Install NSSM to run Python services as Windows services:
choco install nssm
Create a background service for index_server.py:
Run the command: nssm install index_server.
In the dialog:
Set Path as the path to python.exe, for example, C:\Users\user\.conda\envs\qanda\python.exe.
Set Startup directory as the directory containing index_server.py, for example, C:\KnowledgeBase\Test.
Set Arguments as the full path to index_server.py, for example, C:\KnowledgeBase\Test\index_server.py.
Create a background service for flask_demo.py:
Run the command: nssm install flask_demo.
In the dialog:
Set Path as the path to pythonw.exe, for example, C:\Users\user\.conda\envs\qanda\pythonw.exe (note: use pythonw, not python).
Set Startup directory as the directory containing flask_demo.py, for example, C:\KnowledgeBase\Test.
Set Arguments as the full path to flask_demo.py, for example, C:\KnowledgeBase\Test\flask_demo.py.
Start the services (they will start automatically by default):
nssm start index_server
nssm start flask_demo
After starting the index_server service, three JSON files will be created in the saved_index folder:

docstore.json
index_store.json
vector_store.json
Subsequently, after uploading the first file, a file named stored_documents.pkl will be created.
IIS Configuration:
Copy or directly mount the react_frontend/build directory on the IIS server.
ARR/URL Rewrite Configuration:
Install the ARR/URL Rewrite module in IIS.
In URL Rewrite, configure a rule to map a virtual directory (e.g., http://localhost:5001) to another site (http://localhost:4001).
Create a server variable in IIS named HTTP_X_ORIGINAL_HOST.
