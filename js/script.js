async function searchAll() {
    const query = document.getElementById('queryInput').value.trim();
    
    if (!query) {
        alert('Please enter a question!');
        return;
    }
    
    // Show loading, hide previous results
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // Clear previous results
    document.getElementById('aiAnswer').innerHTML = '';
    document.getElementById('videos').innerHTML = '';
    document.getElementById('articles').innerHTML = '';
    document.getElementById('studyMaterials').innerHTML = '';
    document.getElementById('cheatSheets').innerHTML = ''; // NEW
    
    // Run all searches in parallel (including cheat sheets)
    await Promise.all([
        getAIAnswer(query),
        searchYouTube(query),
        searchArticles(query),
        searchStudyMaterials(query),
        searchCheatSheets(query) // NEW
    ]);
    
    // Hide loading, show results
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

// 1 AI
async function getAIAnswer(query) {
    const aiAnswerDiv = document.getElementById('aiAnswer');
    aiAnswerDiv.innerHTML = '<h2>🤖 AI Answer</h2><p>Loading...</p>';
    
    try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        
        console.log('Calling Groq API...');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // ✅ UPDATED MODEL NAME
                messages: [{
                    role: 'user',
                    content: `Explain this topic in detail for students (in 3-4 paragraphs): ${query}`
                }],
                temperature: 0.7,
                max_tokens: 2000 // Also fixed token limit
            })
        });
        
        console.log('Groq Response Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Groq API Error:', errorData);
            throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Request failed'}`);
        }
        
        const data = await response.json();
        console.log('Groq Success!', data);
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const answer = data.choices[0].message.content;
            aiAnswerDiv.innerHTML = `
                <h2>🤖 AI Answer (Powered by Groq Llama 3.3)</h2>
                <p>${answer.replace(/\n/g, '<br><br>')}</p>
            `;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Groq Error:', error);
        aiAnswerDiv.innerHTML = `
            <h2>🤖 AI Answer</h2>
            <p style="color: red;">❌ <strong>Error:</strong> ${error.message}</p>
            <p><strong>Troubleshooting:</strong></p>
            <ul>
                <li>Check your Groq API key in config.js (should start with "gsk_")</li>
                <li>Verify at <a href="https://console.groq.com" target="_blank">Groq Console</a></li>
                <li>Make sure you have API access enabled</li>
            </ul>
        `;
    }
}


// 2. Search YouTube Videos - TOP 5 ONLY
async function searchYouTube(query) {
    const videosDiv = document.getElementById('videos');
    videosDiv.innerHTML = '<h2>📺 Top 5 YouTube Videos</h2><p>Loading...</p>';
    
    try {
        // maxResults=5 ensures we only get top 5 videos
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&order=relevance&key=${CONFIG.YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        let html = '<h2>📺 Top 5 YouTube Videos</h2>';
        
        if (data.items && data.items.length > 0) {
            html += '<ul>';
            // Limit to exactly 5 results
            const top5 = data.items.slice(0, 5);
            top5.forEach((item, index) => {
                const title = item.snippet.title;
                const description = item.snippet.description || 'No description available';
                html += `
                    <li>
                        <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
                            ${index + 1}. ${title}
                        </a>
                        <p>${description.substring(0, 120)}${description.length > 120 ? '...' : ''}</p>
                    </li>
                `;
            });
            html += '</ul>';
        } else {
            html += '<p>No videos found.</p>';
        }
        
        videosDiv.innerHTML = html;
    } catch (error) {
        console.error('YouTube Error:', error);
        videosDiv.innerHTML = `
            <h2>📺 Top 5 YouTube Videos</h2>
            <p style="color: red;">❌ Unable to fetch videos. Check your YouTube API key.</p>
        `;
    }
}


// 3. Search Articles
// Using Serper.dev API - 2,500 free searches, no credit card!
async function searchArticles(query) {
    const articlesDiv = document.getElementById('articles');
    articlesDiv.innerHTML = '<h2>📰 Top 5 Related Articles</h2><p>Loading...</p>';
    
    try {
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': CONFIG.SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: query,
                num: 5
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Serper Response:', data);
        
        let html = '<h2>📰 Top 5 Related Articles</h2>';
        
        if (data.organic && data.organic.length > 0) {
            html += '<ul>';
            data.organic.slice(0, 5).forEach((item, index) => {
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">${index + 1}. ${item.title}</a>
                        <p>${(item.snippet || '').substring(0, 120)}...</p>
                    </li>
                `;
            });
            html += '</ul>';
        } else {
            html += '<p>No articles found.</p>';
        }
        
        articlesDiv.innerHTML = html;
    } catch (error) {
        console.error('Articles Error:', error);
        articlesDiv.innerHTML = `
            <h2>📰 Top 5 Related Articles</h2>
            <p style="color: red;">❌ Error: ${error.message}</p>
        `;
    }
}


// 4. Search Study Materials - IMPROVED VERSION
// Using Serper.dev for study materials
async function searchStudyMaterials(query) {
    const materialsDiv = document.getElementById('studyMaterials');
    materialsDiv.innerHTML = '<h2>📚 Top 5 Study Materials</h2><p>Loading...</p>';
    
    try {
        const pdfQuery = `${query} filetype:pdf`;
        
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': CONFIG.SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: pdfQuery,
                num: 5
            })
        });
        
        const data = await response.json();
        
        let html = '<h2>📚 Top 5 Study Materials</h2>';
        
        if (data.organic && data.organic.length > 0) {
            html += '<ul>';
            data.organic.slice(0, 5).forEach((item, index) => {
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">📕 ${index + 1}. ${item.title}</a>
                        <p>${(item.snippet || '').substring(0, 120)}...</p>
                    </li>
                `;
            });
            html += '</ul>';
        } else {
            html += '<p>No study materials found.</p>';
        }
        
        materialsDiv.innerHTML = html;
    } catch (error) {
        console.error('Study Materials Error:', error);
        materialsDiv.innerHTML = `<h2>📚 Study Materials</h2><p style="color: red;">❌ Error: ${error.message}</p>`;
    }
}


// 5. Search for Cheat Sheets
// Using Serper.dev for cheat sheets
async function searchCheatSheets(query) {
    const cheatSheetsDiv = document.getElementById('cheatSheets');
    cheatSheetsDiv.innerHTML = '<h2>📋 Cheat Sheets</h2><p>Loading...</p>';
    
    try {
        const cheatQuery = `${query} cheat sheet`;
        
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': CONFIG.SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: cheatQuery,
                num: 5
            })
        });
        
        const data = await response.json();
        
        let html = '<h2>📋 Top 5 Cheat Sheets</h2>';
        
        if (data.organic && data.organic.length > 0) {
            html += '<ul>';
            data.organic.slice(0, 5).forEach((item, index) => {
                let icon = '📄';
                if (item.link.includes('cheatography.com')) icon = '⭐';
                else if (item.link.includes('codecademy.com')) icon = '💻';
                
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">${icon} ${index + 1}. ${item.title}</a>
                        <p>${(item.snippet || '').substring(0, 120)}...</p>
                    </li>
                `;
            });
            html += '</ul>';
        } else {
            html += '<p>No cheat sheets found.</p>';
        }
        
        cheatSheetsDiv.innerHTML = html;
    } catch (error) {
        console.error('Cheat Sheets Error:', error);
        cheatSheetsDiv.innerHTML = `<h2>📋 Cheat Sheets</h2><p style="color: red;">❌ Error: ${error.message}</p>`;
    }
}

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on page load
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Dark mode toggle button event listener
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference to localStorage
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
    }
    localStorage.setItem('theme', theme);
    
    // Optional: Add haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    console.log('Theme switched to:', theme);
});

// Optional: Auto-detect system preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User prefers dark mode
        if (!localStorage.getItem('theme')) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Detect system theme on first visit
detectSystemTheme();

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}


// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('queryInput');
    if (input) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchAll();
            }
        });
    }
});
