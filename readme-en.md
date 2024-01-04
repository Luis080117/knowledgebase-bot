# Run locally:
1. Install a Python virtual environment, Anaconda is recommended (https://www.anaconda.com/download)
2. Create a virtual environment: <code>conda create -n llama_index python=3.11</code>
3. Activate the virtual environment: <code>conda activate llama_index</code>
4. Install dependency packages: <code>pip install -r requirements.txt</code>
5. Start the backend service and API in sequence: <code>python index_server.py python flask_demo.py</code>
6. Compile the React frontend code:\ <code>cd react_frontend npm install npm run build </code> The compiled code is under the build folder and can be opened directly in a browser to view effects. It can also be mounted on an IIS server.
7. Debug and run the frontend: <code>npm start</code>

# Deploy to server:
1. Install a Python virtual environment, Anaconda is recommended (https://www.anaconda.com/download)

2. Create a virtual environment: <code>conda create -n llama_index python=3.11</code>

3. Activate the virtual environment: <code>conda activate llama_index</code>

4. Install dependency packages: <code>pip install -r requirements.txt</code>

5. Install chocolatey (https://chocolatey.org/install) for next step of installing nssm. In Powershell admin mode, run:\ <code>Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))</code>

6. Configurations to modify (to deploy multiple versions on one machine, use different ports):

index_server.py\ <code>manager = BaseManager(('', 3002), b'password')</code>
flask_demo.py <code>manager = BaseManager(('127.0.0.1', 3002), b'password') serve(app, host="0.0.0.0", port=3001) </code> After compilation, obtain
Website\static\js\main.xxx.js
Search for <code>API_URL</code> in it and change to correct address
Can also modify before compilation: KnowledgeBase\react_frontend\src\authConfig.js KnowledgeBase\react_frontend\src\apis\config.ts

7. Install nssm for running python services in background (Windows Service):\ <code>choco install nssm</code>

8. Create a background service for <u>index_server.py</u>

- Execute command: <code>nssm install index_server</code> A dialog pops up
- In <u>Path</u> fill in path to <u>python.exe</u>, e.g. <code>C:\Users\borelli.conda\envs\qanda\python.exe</code>
- In <u>Startup directory</u> fill in directory where <u>index_server.py</u> is located, e.g. <code>C:\KnowledgeBase\Test</code>
- In <u>Arguments</u> fill in full path to <u>index_server.py</u>, e.g. <code>C:\KnowledgeBase\Test\index_server.py</code>
9. Create a background service for <u>flask_demo.py</u>

- Execute command: <code>nssm install flask_demo</code> A dialog pops up
- In <u>Path</u> fill in path to <u>pythonw.exe</u>, e.g. <code>C:\Users\borelli.conda\envs\qanda\pythonw.exe</code>, note use pythonw, not python
- In <u>Startup directory</u> fill in directory where <u>flask_demo.py</u> is located, e.g. <code>C:\KnowledgeBase\Test</code>
- In <u>Arguments</u> fill in full path to <u>flask_demo.py</u>, e.g. <code>C:\KnowledgeBase\Test\flask_demo.py</code>

10. Start services, can also be viewed and manually started in service manager, will auto start by default:\ <code>nssm start index_server
nssm start flask_demo</code>
After starting index_server service, 3 json files will be created in saved_index:

- docstore.json
- index_store.json
- vector_store.json
Then after uploading first file, file will be created

- stored_documents.pkl

11. IIS configuration, copy <code>react_frontend/build</code> directory or directly mount to IIS server

12. ARR/URL Rewrite configuration: Map a virtual directory under default (e.g. <u>http://aikb.cipplanner.net/nycdot-api/</u>) to another site (<u>http://aikb.cipplanner.net:4001</u>)

Install ARR/URL Rewrite module in IIS
https://download.microsoft.com/download/E/9/8/E9849D6A-020E-47E4-9FD0-A023E99B54EB/requestRouter_amd64.msi
https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi

Allow Proxy in ARR Module
In IIS under server node, double click <u>Application Request Routing Cache</u>, click <u>Server Proxy Settings</u> on right, check <u>Enable Proxy</u>, click <u>Apply</u>

Configure URL Rewrite:
In <u>default website</u>, double click <u>URL Rewrite</u>, click <u>Add Rule</u> on right, add a <u>inbound rules -> Blank rule</u>
Name can be anything
Pattern is <u>nycdot-api/(.*)</u>
Rewrite URL is <u>http://aikb.cipplanner.net:4001/{R:1}</u>
Check <u>Stop processing of subsequent rules</u>
Configure server variable
In <u>URL Rewrite</u> on right side <u>view server variables</u>, add a server variable named <u>HTTP_X_ORIGINAL_HOST</u>, entry Type is <u>Local</u>
In the Rule just added in <u>URL Rewrite</u>, expand server variable, select server variable named <u>HTTP_X_ORIGINAL_HOST</u>, value is <u>{HTTP_HOST}</u>, check <u>Replace existing value</u>

13. Rebuild database:

- Delete <u>saved_index</u> directory (including all files and folder itself)
- Delete <u>stored_documents.pkl</u> file
- Retain <u>documents</u> directory