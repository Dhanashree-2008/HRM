// Native fetch used (Node 18+)

const testChatbot = async () => {
    const url = 'http://localhost:5000/api/chatbot/ask';
    const data = {
        orgData: "TechCorp is a leading software company. CEO is Alice Smith. Founded in 2010.",
        query: "Who is the CEO of TechCorp?"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response from Chatbot:", result);
    } catch (error) {
        console.error("Test failed:", error);
    }
};

testChatbot();
