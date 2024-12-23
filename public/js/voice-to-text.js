function startVoiceRecognition(inputId) {
    // Check if the Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('Speech Recognition API not supported in this browser.');
        alert('Your browser does not support the Speech Recognition API. Please use a supported browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        console.log('Speech recognized:', speechResult);
        document.getElementById(inputId).value = speechResult;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onspeechend = () => {
        recognition.stop();
        console.log('Speech recognition has stopped.');
    };
}
