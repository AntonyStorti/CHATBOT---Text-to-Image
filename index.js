document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

                            // GESTISCE IL BOTTONE DI INVIO //

    sendButton.addEventListener('click', () => {

        const userMessage = userInput.value.trim();
        if (userMessage !== '') {

            // Mostra la clessidra
            loader.style.display = 'block';

            const userMessageDiv = document.getElementById('user-input-text');
            userMessageDiv.textContent = `"${userMessage}"`;

            // Creiamo un oggetto JSON per inviare il testo
            const jsonData = {
                message: userMessage
            };

            // Effettua una richiesta AJAX (POST) all'app Python con il tipo di contenuto JSON
            fetch('http://127.0.0.1:5000/invia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specifica il tipo di contenuto JSON
                },
                body: JSON.stringify(jsonData) // Converte l'oggetto JSON in una stringa JSON
            })
                .then(response => response.blob()) // Ricevi la risposta come BLOB

                .then(blob => {

                    // Creiamo un URL per il blob e creiamo un elemento img
                    const imgUrl = URL.createObjectURL(blob);
                    const imgElement = document.createElement('img');
                    imgElement.src = imgUrl;
                    imgElement.alt = 'Immagine del chatbot';

                    // Definiamo la larghezza massima per l'immagine (500px, la larghezza del div chat-messages)
                    imgElement.style.maxWidth = '500px'; 

                    // Definiamo l'altezza massima per l'immagine (382px, l'altezza del div chat-messages)
                    imgElement.style.maxHeight = '346px'; 

                    // Creiamo un div per contenere l'immagine e aggiungerla alla chatMessages
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('message');
                    imageContainer.appendChild(imgElement);
                    chatMessages.appendChild(imageContainer);

                    // Nascondi la casella di testo e il tasto Invia
                    userInput.style.display = 'none';
                    sendButton.style.display = 'none';

                    // Mostra il bottone di reset e assegna la classe CSS
                    const resetButton = document.getElementById('reset-button');
                    resetButton.style.display = 'block';
                    resetButton.classList.add('reset-button');

                    // Nascondi la clessidra
                    loader.style.display = 'none';

                })

                .catch(error => {
                    console.error('Errore nella chiamata all\'app Python:', error);
                    loader.style.display = 'none';
                });


            // Pulisci la casella di testo
            userInput.value = '';



                                // GESTISCE IL BOTTONE DI RESET //

            const resetButton = document.getElementById('reset-button');

            resetButton.addEventListener('click', () => {

                // Ripristina la casella di testo e il tasto Invia
                userInput.style.display = 'block';
                sendButton.style.display = 'block';

                // Nascondi nuovamente il bottone di reset
                resetButton.style.display = 'none';

                // Pulisci la casella di testo
                userInput.value = '';

                // Svuota il contenuto del div "chat-messages"
                chatMessages.innerHTML = '';
                userMessageDiv.style.display = 'none';
                userMessageDiv.textContent = '';

                // Aggiorna la pagina: pronta per una nuova richiesta.
                window.location.reload();

            });

        }
    });
});