const app = document.querySelector('.app'),
    mode = document.querySelector('#mode'),

    chats = document.querySelector('.chats'),
    add_chat=document.querySelector('#add-chat'),

    clear = document.querySelector('#delete'),

    qna = document.querySelector('.qna'),

    input = document.querySelector('.request input'),

    send = document.querySelector('#send'),
    
    OPENAI_API_KEY= "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",
    url = "https://api.openai.com/v1/chat/completions";



    mode.addEventListener('click', toggleMode);

    add_chat.addEventListener('click', addNewChat);

    send.addEventListener('click', getAnswer);

    input.addEventListener('keyup', (e)=>{
        if(e.ke === 'Enter') {
            getAnswer();
        }
    });

    clear.addEventListener('click', ()=> chats.innerHTML ='');
    // update.. light mode & dark mode
    function toggleMode() {
        const light_mode = app.classList.contains('light');
        app.classList.toggle('light', !light_mode);
    
        mode.innerHTML = `<iconify-icon icon="bi:${ light_mode ? 'brightness-high': 'moon'}" class="icon"></iconify-icon>${light_mode ? 'Light Mode' : 'dark mode'} `
    }


    // create tab for new chat

    function addNewChat(){
        chats.innerHTML += `
        <li>
                        <div>
                            <iconify-icon icon="bi:chat-left-text" class="icon"></iconify-icon>
                            <span class="chat-title" contenteditable>New Chat</span>
                        </div>
                        <div>
                            <iconify-icon icon="bi:trash3" class="icon" onclick="removeChat(this)"></iconify-icon>
                            <iconify-icon icon="bi:pencil-square" class="icon" onclick="updateChatTitle(this)"></iconify-icon>
                        </div>
                    </li>
        `;
    }

    const removeChat = (el)=> el.parentElement.parentElement.remove();
    const updateChatTitle = (el)=> el.parentElement.previousElementSibling.lastElementChild.focus();

    //Displaying user question & bot Answer

    async function getAnswer() {
        const options = {
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: input.value}],
                    "temperature": 0,
                    max_tokens: 1200
                   
            })
        }
        try{
            if(input.value.length >= 3){
                const id = generateId();
                const question = input.value;
                app.querySelector('.hints p').innerHTML = question;
                qna.innerHTML += createChat(question, id);
                qna.scrollTop = qna.scrollHeight;
    
    
                const p = document.getElementById(id);

                input.setAttribute('readonly', true);
                send.setAttribute('disabled', true);
                
                const res = await fetch(url, options);
                
                if(res.ok){
                    p.innerHTML = "";
                    input.value = "";

                    input.removeAttribute('readonly');
                    send.removeAttribute('disabled');

                    const data = await res.json();
                    const msg = data.choices[0].message.content;
    
                    typeWriter(p, msg);
                }
            }
            
        }
        catch(err){
            console.error(err);
        }
    }


    function createChat(question,id){
        return(
            `
            <div class="result">
                <div class="question">
                    <iconify-icon icon="bi:person-circle" class="icon blue"></iconify-icon>
                    <h3>${question}</h3>
                </div>


                <div class="answer">
                    <iconify-icon icon="bi:robot" class="icon green"></iconify-icon>
                    <p id="${id}"><iconify-icon icon="eos-icons:three-dots-loading" width="70" height="50"></iconify-icon></p>
                </div>
            </div>
            `
        );
    }

    //Generate id function
    function generateId(){
        const id = Math.random.toString(16) + Date.now();
        return id.substr(2, id.length - 2); 
    }

    // TypeWriter effect
    function typeWriter(el, ans){
        let i =0,
        interval = setInterval(() => {
            qna.scrollTop = qna.scrollHeight;
            if(i< ans.length){
                el.innerHTML += ans.charAt(i);
                i++;
            }else{
                clearInterval(interval)
            }

        }, 13);
    }
    document.onkeydown=function(){
        if(window.event.keyCode=='13'){
            getAnswer();
        }
    }

    // Function to handle code analysis and optimization
async function analyzeCode() {
    // Retrieve user's code
    const code = input.value.trim();

    // Check if code is provided
    if (!code) {
        return;
    }

    try {
        // Disable Input and Send Button
        input.setAttribute('readonly', true);
        send.setAttribute('disabled', true);

        // API Request Payload
        const payload = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: code }],
            temperature: 0,
            max_tokens: 1200
        };

        // API Request Options
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        };

        // Make API call to ChatGPT API
        const response = await fetch(url, options);
        const data = await response.json();

        // Process response and display result
        const optimizedCode = data.choices[0].message.content;
        displayMessage('bot', optimizedCode);

    } catch (error) {
        console.error(error);
    } finally {
        // Enable Input and Send Button
        input.removeAttribute('readonly');
        send.removeAttribute('disabled');
    }
}


// Add event listeners to the buttons for Code Analysis and Documentation Generation
document.getElementById('analyze').addEventListener('click', analyzeCode);
document.getElementById('generate-docs').addEventListener('click', generateDocumentation);

// Function to handle code analysis and optimization
async function analyzeCode() {
    console.log("Button clicked!");
    // Retrieve user's code
    const code = input.value.trim();

    // Check if code is provided
    if (!code) {
        return;
    }

    try {
        // Disable Input and Send Button
        input.setAttribute('readonly', true);
        send.setAttribute('disabled', true);

        // API Request Payload
        const payload = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: code }],
            temperature: 0,
            max_tokens: 1200
        };

        // API Request Options
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        };

        // Make API call to ChatGPT API
        const response = await fetch(url, options);
        const data = await response.json();

        // Process response and display result
        const optimizedCode = data.choices[0].message.content;
        displayMessage('bot', optimizedCode);

    } catch (error) {
        console.error(error);
    } finally {
        // Enable Input and Send Button
        input.removeAttribute('readonly');
        send.removeAttribute('disabled');
    }
}

// Function to handle code documentation generation
async function generateDocumentation() {
    // Retrieve user's code
    const code = input.value.trim();

    // Check if code is provided
    if (!code) {
        return;
    }

    try {
        // Disable Input and Send Button
        input.setAttribute('readonly', true);
        send.setAttribute('disabled', true);

        // API Request Payload
        const payload = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Generate documentation for code:\n${code}` }],
            temperature: 0,
            max_tokens: 1200
        };

        // API Request Options
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        };

        // Make API call to ChatGPT API
        const response = await fetch(url, options);
        const data = await response.json();

        // Process response and display result
        const documentation = data.choices[0].message.content;
        displayMessage('bot', documentation);

    } catch (error) {
        console.error(error);
    } finally {
        // Enable Input and Send Button
        input.removeAttribute('readonly');
        send.removeAttribute('disabled');
    }
}
