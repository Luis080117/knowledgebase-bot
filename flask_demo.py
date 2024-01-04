import hashlib
import os
from waitress import serve
from multiprocessing.managers import BaseManager
from flask import Flask, request, jsonify, make_response, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
import hashlib
import logging


DOCUMENTS_DIR = "./documents"

logging.basicConfig(level=logging.DEBUG)
doc_hashes = {'title': set(), 'content': set()}

app = Flask(__name__)
CORS(app)

# initialize manager connection
manager = BaseManager(('127.0.0.1', 4003), b'password')
manager.register('query_index')
manager.register('insert_into_index')
manager.register('get_documents_list')
manager.register('ensure_unique_name')
manager.connect()

@app.route("/query", methods=["GET"])
def query_index():
    global manager
    query_text = request.args.get("text", None)
    if query_text is None:
        return "No text found, please include a ?text=blah parameter in the URL", 400
    
    response = manager.query_index(query_text)._getvalue()
    response_json = {
        "text": str(response),
        "sources": [{"text": str(x.node.text), 
                     "similarity": round(x.score, 3),
                     "doc_id": str(x.node.ref_doc_id),
                     "start": x.node.start_char_idx,
                     "end": x.node.end_char_idx
                    } for x in response.source_nodes]
    }
    return make_response(jsonify(response_json)), 200

@app.route("/uploadFile", methods=["POST"])
def upload_file():
    global manager
    logging.debug("Upload file request received")
    
    if 'file' not in request.files:
        return "Please send a POST request with a file", 400
    
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        logging.debug(f"Processing file: {filename}")
        
        filepath = os.path.join('documents', os.path.basename(filename))
        uploaded_file.save(filepath)
        logging.debug(f"File saved to {filepath}")

        if doc_hashes['title'] or doc_hashes['content']:
            with open(filepath, 'r') as file:
                content = file.read()
                content_hash = hashlib.md5(content.encode()).hexdigest()
                title_hash = hashlib.md5(filename.encode()).hexdigest()
                
                if title_hash in doc_hashes['title']:
                    logging.debug("Duplicate title detected")
                    raise Exception("Duplicate title detected!")
                elif content_hash in doc_hashes['content']:
                    logging.debug("Duplicate content detected")
                    raise Exception("Duplicate content detected!")

        if request.form.get("filename_as_doc_id", None) is not None:
            manager.insert_into_index(filepath, doc_id=filename)
        else:
            manager.insert_into_index(filepath)
        logging.debug(f"File {filename} inserted into index")

    except Exception as e:
        logging.error(f"Error processing file: {str(e)}")
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        
        return str(e), 500

    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)

    return "File inserted!", 200

@app.route("/batchUpload", methods=["GET"])
def batch_upload():
    global manager
    dir_path = './upload/'
    files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    for filename in files:
        filepath = os.path.join(dir_path, filename)
        try:
            if filename:
                manager.insert_into_index(filepath, doc_id=filename)
            else:
                manager.insert_into_index(filepath)
        except Exception as e:
            return "Error: {}".format(str(e)), 500

    return "All files in directory inserted!", 200

@app.route("/getDocuments", methods=["GET"])
def get_documents():
    document_list = manager.get_documents_list()._getvalue()
    return make_response(jsonify(document_list)), 200

from flask import send_from_directory, abort

@app.route("/downloadDocument/<document_id>", methods=["GET"])
def download_document(document_id):
    # Extract the base filename from document_id 
    print(document_id)
    base_filename = document_id.rsplit('_', 1)[0] if '_' in document_id else document_id
    
    # Go through the documents in the 'documents' directory
    for file in os.listdir('documents'):
        if file.startswith(base_filename):
            # If we find a matching document, send it for download
            return send_from_directory('documents', file, as_attachment=True)
    
    # If no matching document is found, return a 404 error
    abort(404, description="Document not found.")

@app.route("/")
def home():
    return "Hello, World! Welcome to the llama_index docker image!"

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=4103)