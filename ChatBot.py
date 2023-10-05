import subprocess
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS



                        ##### GESTISCE IL SERVER PYTHON #####

app = Flask(__name__)
CORS(app)  # Abilita CORS per tutta l'app


@app.route('/')
def index():
    return 'I am a Server Python!'


#RICEVE QUELLO CHE L'UTENTE HA SCRITTO E L'INVIA ALLO SCRIPT CHE IMPLEMENTA L'API
@app.route('/invia', methods=['POST'])
def invia_testo():

    if request.method == 'POST':

        data = request.json  # Riceve i dati JSON inviati dal JavaScript
        user_message = data.get('message')

        # Chiama un processo figlio e riceve in risposta il nome del file immagine
        result = subprocess.run(['python3', "API.py", user_message], stdout=subprocess.PIPE, text=True)
        file_name = result.stdout.strip()

        # Mostra a video l'immagine elaborata dal processo figlio
        return send_file(file_name, mimetype="image/png")


if __name__ == '__main__':
    app.run(debug=True)