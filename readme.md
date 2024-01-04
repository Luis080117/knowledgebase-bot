#本地运行：
1. 安装python虚拟环境，建议用anaconda (https://www.anaconda.com/download)
2. 创建虚拟环境：<code>conda create -n llama_index python=3.11</code>
3. 激活虚拟环境：<code>conda activate llama_index</code>
4. 安装依赖包：<code>pip install -r requirements.txt</code>
5. 依次运行后端服务和API：  
    <code>python index_server.py  
    python flask_demo.py</code>
6. 编译React前端代码：  
    <code>cd react_frontend  
    npm install  
    npm run build
    </code>  
    编译后的代码在build文件夹下，可以直接用浏览器打开index.html查看效果，也可以挂载到IIS服务器上
7. 调试运行前端：  
    <code>npm start</code>

#部署到服务器：
1. 安装python虚拟环境，建议用anaconda (https://www.anaconda.com/download)
2. 创建虚拟环境：<code>conda create -n llama_index python=3.11</code>
3. 激活虚拟环境：<code>conda activate llama_index</code>
4. 安装依赖包：<code>pip install -r requirements.txt</code>
5. 安装chocolatey (https://chocolatey.org/install)，用于下一步的安装nssm。在powershell中以administrator方式运行：  
    <code>Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))</code>

6. 要修改的配置（一台机器上要部署多个版本，用不同的端口）：
    - index_server.py  
    <code>manager = BaseManager(('', 3002), b'password')</code>

    - flask_demo.py  
    <code>manager = BaseManager(('127.0.0.1', 3002), b'password')  
        serve(app, host="0.0.0.0", port=3001)
    </code>

    编译后得到
     - Website\static\js\main.xxx.js
    在其中搜索 <code>API_URL</code>，改为正确地址
    也可在编译前修改:
                KnowledgeBase\react_frontend\src\authConfig.js
                KnowledgeBase\react_frontend\src\apis\config.ts

7. 安装nssm，用于后台运行python服务（Windows Service）：
    <code>choco install nssm</code>

8. 为<u>index_server.py</u>创建一个后台服务
    - 执行命令：<code>nssm install index_server</code> 弹出一个对话框  
    - 在<u>Path</u>中填写<u>python.exe</u>的路径，例如 <code>C:\Users\borelli\.conda\envs\qanda\python.exe</code>
    - 在<u>Startup directory</u>中填写<u>index_server.py</u>所在的目录，例如<code>C:\KnowledgeBase\Test</code>
    - 在<u>Arguments</u>中填写<u>index_server.py</u>的完整路径，让例如<code>C:\KnowledgeBase\Test\index_server.py</code>

9. 为<u>flask_demo.py</u>创建一个后台服务
    - 执行命令：<code>nssm install flask_demo</code> 弹出一个对话框  
    - 在<u>Path</u>中填写<u>pythonw.exe</u>的路径，例如 <code>C:\Users\borelli\.conda\envs\qanda\pythonw.exe</code>, 注意是用pythonw，不是python  
    - 在<u>Startup directory</u>中填写<u>flask_demo.py</u>所在的目录，例如<code>C:\KnowledgeBase\Test</code>
    - 在<u>Arguments</u>中填写<u>flask_demo.py</u>的完整路径，让例如<code>C:\KnowledgeBase\Test\flask_demo.py</code>
    
10. 启动服务，也可以在service manageer中看到服务并手工启动，默认将会自动启动：  
    <code>nssm start index_server  
    nssm start flask_demo
    </code>  
    启动index_server服务后，将会在saved_index创建3个json文件:
    - docstore.json
    - index_store.json
    - vector_store.json  

    接着上传第一个文件之后，将会创建文件
    - stored_documents.pkl

10. IIS配置，将 <code>react_frontend/build</code> 目录复制或直接挂载到IIS服务器上

11. ARR/URL Rewrite配置：目的是为了将一个default目录下的虚拟目录（例如<u>http://aikb.cipplanner.net/nycdot-api/</u>），映射到另外一个站点（<u>http://aikb.cipplanner.net:4001</u>）
    * 在IIS中安装ARR/URL Rewrite模块 
        - https://download.microsoft.com/download/E/9/8/E9849D6A-020E-47E4-9FD0-A023E99B54EB/requestRouter_amd64.msi
        - https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi

    * 在ARR Module 允许 Proxy    
    在IIS中的server节点下，双击<u>Application Request Routing Cache</u>，点击右侧的<u>Server Proxy Settings</u>，勾选<u>Enable Proxy</u>，点击<u>Apply</u>
    
    * 配置URL Rewrite:   
    在<u>default website</u>，双击 <u>URL Rewrite</u>，点击右侧的 <u>Add Rule</u>，添加一个<u>inbound rules -> Blank rule </u>
        - Name随便填
        - Pattern填 <u>nycdot-api/(.*)</u>
        - Rewrite URL填 <u> http://aikb.cipplanner.net:4001/{R:1} </u>
        - 勾选 <u>Stop processing of subsequent rules</u>

    * 配置 server variable
        - 在<u>URL Rewrite</u>的右侧的<u>view server variables</u>中，添加一个名为<u>HTTP_X_ORIGINAL_HOST</u>的server variable, entry Type填<u>Local</u>  
        - 在<u>URL Rewrite</u>的刚才添加的Rule中，展开server variable，选择名为<u>HTTP_X_ORIGINAL_HOST</u>的server variable，值为<u>{HTTP_HOST}</u>，勾选<u>Replace existing value</u>

12. 重建数据库：
    - 删除<u>saved_index</u>目录（含所有文件及文件夹本身）  
    - 删除<u>stored_documents.pkl</u>文件  
    - 保留<u>documents</u>目录  

13. 批量上传
    把文件放到<u>upload</u>目录，调用<code>/batchUpload </code>这个API