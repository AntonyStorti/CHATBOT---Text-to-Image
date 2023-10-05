import os
import ssl
import sys
import json
import openai
import urllib.request
from datetime import datetime


# Setta l'API di OpenAI come variabile globale: usabile in ogni script
os.environ["OPENAI_API_KEY"] = "***"


# Recupera la variabile passata come argomento dalla riga di comando
user_prompt = sys.argv[1]


# Definisce il percorso del file per la cache
cache_file_path = "image_cache.json"

# Carica il file di cache
image_cache = {}
if os.path.exists(cache_file_path):
    with open(cache_file_path, "r") as cache_file:
        image_cache = json.load(cache_file)


# Verifica se il prompt è già nella cache:

if user_prompt in image_cache:

    # Se il prompt è nella cache, utilizza l'immagine esistente invece di chiamare l'API
    file_name = image_cache[user_prompt]

else:

    # Chiama l'API per generare un'immagine


    ################## API #######################
    openai.api_key = os.getenv("OPENAI_API_KEY")

    response = openai.Image.create(
        prompt=user_prompt,
        n=1,
        size="256x256"
    )

    image_url = response['data'][0]['url']
    ##############################################


    # Ignora temporaneamente la verifica del certificato SSL
    ssl._create_default_https_context = ssl._create_unverified_context


    # Scarica l'immagine dall'URL ricevuto come risposta dalla chiamata all'API
    file_name = "image" + datetime.now().strftime('%Y-%m-%d-%H-%M-%S') + ".png"
    urllib.request.urlretrieve(image_url, file_name)


    # Aggiungi il prompt e il percorso del file all'immagine alla cache
    image_cache[user_prompt] = file_name

    # Salva la cache aggiornata nel file
    with open(cache_file_path, "w") as cache_file:
        json.dump(image_cache, cache_file)



# Salva il nome dell'immagine: per passarla al processo padre/chiamante
print(file_name)
