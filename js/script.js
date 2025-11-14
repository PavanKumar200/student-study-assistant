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

// CORRECTED: Using the new model name
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
async function searchArticles(query) {
    const articlesDiv = document.getElementById('articles');
    articlesDiv.innerHTML = '<h2>📰 Related Articles</h2><p>Loading...</p>';
    
    try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_CSE_KEY}&cx=${CONFIG.GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}&num=5`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        let html = '<h2>📰 Related Articles</h2>';
        
        if (data.items && data.items.length > 0) {
            html += '<ul>';
            data.items.forEach(item => {
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">📄 ${item.title}</a>
                        <p>${item.snippet || ''}</p>
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
            <h2>📰 Related Articles</h2>
            <p style="color: red;">❌ Unable to fetch articles. Error: ${error.message}</p>
        `;
    }
}

// 4. Search Study Materials - IMPROVED VERSION
async function searchStudyMaterials(query) {
    const materialsDiv = document.getElementById('studyMaterials');
    materialsDiv.innerHTML = '<h2>📚 Study Materials</h2><p>Loading...</p>';
    
    try {
        if (!CONFIG.GOOGLE_CSE_KEY || !CONFIG.GOOGLE_CSE_ID) {
            throw new Error('API key or Search Engine ID is missing');
        }
        
        // IMPROVED: Search the entire web for PDFs and PPTs (not just Google Drive)
        // Google Drive has limited publicly available files
        const pdfQuery = `${query} filetype:pdf`;
        const pptQuery = `${query} filetype:ppt OR filetype:pptx`;
        
        console.log('Searching for study materials...');
        console.log('PDF Query:', pdfQuery);
        console.log('PPT Query:', pptQuery);
        
        const [pdfResponse, pptResponse] = await Promise.all([
            fetch(`https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_CSE_KEY}&cx=${CONFIG.GOOGLE_CSE_ID}&q=${encodeURIComponent(pdfQuery)}&num=5`),
            fetch(`https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_CSE_KEY}&cx=${CONFIG.GOOGLE_CSE_ID}&q=${encodeURIComponent(pptQuery)}&num=5`)
        ]);
        
        console.log('PDF Response Status:', pdfResponse.status);
        console.log('PPT Response Status:', pptResponse.status);
        
        const pdfData = pdfResponse.ok ? await pdfResponse.json() : null;
        const pptData = pptResponse.ok ? await pptResponse.json() : null;
        
        console.log('PDF Results:', pdfData);
        console.log('PPT Results:', pptData);
        
        let html = '<h2>📚 Study Materials</h2>';
        let foundAny = false;
        
        if (pdfData && pdfData.items && pdfData.items.length > 0) {
            html += '<h3>📕 PDF Documents</h3><ul>';
            pdfData.items.forEach(item => {
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">${item.title}</a>
                        <p>${item.snippet || ''}</p>
                    </li>
                `;
            });
            html += '</ul>';
            foundAny = true;
        }
        
        if (pptData && pptData.items && pptData.items.length > 0) {
            html += '<h3>📊 Presentations (PPT/PPTX)</h3><ul>';
            pptData.items.forEach(item => {
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">${item.title}</a>
                        <p>${item.snippet || ''}</p>
                    </li>
                `;
            });
            html += '</ul>';
            foundAny = true;
        }
        
        if (!foundAny) {
            html += `
                <p>ℹ️ No study materials found for "${query}".</p>
                <p><strong>Tips:</strong></p>
                <ul>
                    <li>Try more specific search terms (e.g., "photosynthesis biology")</li>
                    <li>Common topics tend to have more publicly available materials</li>
                    <li>Make sure your Custom Search Engine is set to "Search the entire web"</li>
                </ul>
            `;
        }
        
        materialsDiv.innerHTML = html;
    } catch (error) {
        console.error('Study Materials Error:', error);
        materialsDiv.innerHTML = `
            <h2>📚 Study Materials</h2>
            <p style="color: red;">❌ Error: ${error.message}</p>
            <p>Check browser Console (F12) for details.</p>
        `;
    }
}

// 5. Search for Cheat Sheets
async function searchCheatSheets(query) {
    const cheatSheetsDiv = document.getElementById('cheatSheets');
    cheatSheetsDiv.innerHTML = '<h2>📋 Cheat Sheets</h2><p>Loading...</p>';
    
    try {
        if (!CONFIG.GOOGLE_CSE_KEY || !CONFIG.GOOGLE_CSE_ID) {
            throw new Error('API key or Search Engine ID is missing');
        }
        
        // Search for cheat sheets from popular educational sites
        const cheatSheetQuery = `${query} cheat sheet`;
        
        // Also search for "quick reference" as an alternative
        const quickRefQuery = `${query} quick reference guide`;
        
        console.log('Searching for cheat sheets...');
        console.log('Cheat Sheet Query:', cheatSheetQuery);
        
        // Search for both types
        const [cheatResponse, quickRefResponse] = await Promise.all([
            fetch(`https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_CSE_KEY}&cx=${CONFIG.GOOGLE_CSE_ID}&q=${encodeURIComponent(cheatSheetQuery)}&num=5`),
            fetch(`https://www.googleapis.com/customsearch/v1?key=${CONFIG.GOOGLE_CSE_KEY}&cx=${CONFIG.GOOGLE_CSE_ID}&q=${encodeURIComponent(quickRefQuery)}&num=3`)
        ]);
        
        console.log('Cheat Sheet Response Status:', cheatResponse.status);
        console.log('Quick Reference Response Status:', quickRefResponse.status);
        
        const cheatData = cheatResponse.ok ? await cheatResponse.json() : null;
        const quickRefData = quickRefResponse.ok ? await quickRefResponse.json() : null;
        
        let html = '<h2>📋 Cheat Sheets & Quick References</h2>';
        let foundAny = false;
        
        // Combine results and remove duplicates
        const allResults = [];
        const seenUrls = new Set();
        
        if (cheatData && cheatData.items) {
            cheatData.items.forEach(item => {
                if (!seenUrls.has(item.link)) {
                    allResults.push(item);
                    seenUrls.add(item.link);
                }
            });
        }
        
        if (quickRefData && quickRefData.items) {
            quickRefData.items.forEach(item => {
                if (!seenUrls.has(item.link)) {
                    allResults.push(item);
                    seenUrls.add(item.link);
                }
            });
        }
        
        if (allResults.length > 0) {
            html += '<ul>';
            allResults.forEach(item => {
                // Check if it's from a popular cheat sheet site
                let icon = '📄';
                if (item.link.includes('cheatography.com')) icon = '⭐';
                else if (item.link.includes('overapi.com')) icon = '⭐';
                else if (item.link.includes('codecademy.com')) icon = '💻';
                else if (item.link.includes('geeksforgeeks.org')) icon = '💻';
                else if (item.link.includes('github.com')) icon = '💻';
                
                html += `
                    <li>
                        <a href="${item.link}" target="_blank">${icon} ${item.title}</a>
                        <p>${item.snippet || ''}</p>
                    </li>
                `;
            });
            html += '</ul>';
            foundAny = true;
        }
        
        if (!foundAny) {
            html += `
                <p>ℹ️ No cheat sheets found for "${query}".</p>
                <p><strong>Recommended Cheat Sheet Websites:</strong></p>
                <ul>
                    <li><a href="https://cheatography.com" target="_blank">📄 Cheatography - 6,000+ Free Cheat Sheets</a></li>
                    <li><a href="https://overapi.com" target="_blank">💻 OverAPI - Programming Cheat Sheets</a></li>
                    <li><a href="https://www.codecademy.com/resources/cheatsheets/all" target="_blank">💻 Codecademy - Coding Cheat Sheets</a></li>
                    <li><a href="https://www.geeksforgeeks.org/cheatsheets/" target="_blank">💻 GeeksforGeeks - All Coding Cheat Sheets</a></li>
                    <li><a href="https://zerotomastery.io/cheatsheets/" target="_blank">💻 Zero to Mastery - Tech Cheat Sheets</a></li>
                </ul>
            `;
        }
        
        cheatSheetsDiv.innerHTML = html;
    } catch (error) {
        console.error('Cheat Sheets Error:', error);
        cheatSheetsDiv.innerHTML = `
            <h2>📋 Cheat Sheets</h2>
            <p style="color: red;">❌ Error: ${error.message}</p>
            <p>Browse popular cheat sheet sites manually:</p>
            <ul>
                <li><a href="https://cheatography.com" target="_blank">Cheatography.com</a></li>
                <li><a href="https://overapi.com" target="_blank">OverAPI.com</a></li>
                <li><a href="https://www.geeksforgeeks.org/cheatsheets/" target="_blank">GeeksforGeeks</a></li>
            </ul>
        `;
    }
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
