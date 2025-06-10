const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 1. AI Drip Score - Rate outfit 0-100 with Gen Z commentary
async function getDripScore(imageUrl, caption = "") {
  try {
    const prompt = `You are a fashion critic for a Gen Z style app called DripCheck. Rate this outfit and return ONLY a JSON response:

    Image: ${imageUrl}
    Caption: ${caption}

    Rate the outfit 0-100 and give a short, fire Gen Z comment. Examples:
    - "Bold color blocking. This fit gives 90s New York vibes. 88/100"
    - "Clean minimalist energy. Very 'that girl' aesthetic. 92/100"
    - "Mid fit but the confidence saves it. 67/100"

    Return JSON format:
    {
      "score": number,
      "comment": "string"
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response or fallback
    try {
      return JSON.parse(response);
    } catch {
      return {
        score: Math.floor(Math.random() * 30) + 70,
        comment: response.replace(/```json|```/g, '').trim()
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      score: 75,
      comment: "Drip detected! Keep serving looks ✨"
    };
  }
}

// 2. Battle AI Commentary - Celebrity judge picks winner
async function getBattleJudge(outfit1Url, outfit2Url) {
  try {
    const prompt = `You're a celebrity fashion expert judging a drip battle on DripCheck. 

    Outfit 1: ${outfit1Url}
    Outfit 2: ${outfit2Url}

    Pick a winner and explain in ONE Gen Z sentence. Be spicy but constructive. Examples:
    - "Outfit 2 wins - that layering is chef's kiss and the fit screams main character energy"
    - "Outfit 1 takes it - color coordination is immaculate, very 'clean girl who goes out'"

    Return JSON:
    {
      "winner": 1 or 2,
      "comment": "string"
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        winner: Math.random() > 0.5 ? 1 : 2,
        comment: response.replace(/```json|```/g, '').trim()
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      winner: 1,
      comment: "Both fits are serving! This battle was too close to call 🔥"
    };
  }
}

// 3. Style Tips - Fashion advice for improvement
async function getStyleTips(imageUrl, description = "") {
  try {
    const prompt = `You're a Gen Z fashion advisor. Give 2 styling tips for this outfit:

    Image: ${imageUrl}
    Description: ${description}

    Make suggestions fun, practical, and Gen Z. Examples:
    - "Try chunky gold jewelry to elevate this look"
    - "Layer with a cropped cardigan for cozy vibes"
    - "Switch to platform boots for extra main character energy"

    Return JSON:
    {
      "tips": ["tip1", "tip2"]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        tips: [
          "Add some statement accessories to make it pop!",
          "Try layering for more dimension and texture ✨"
        ]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      tips: [
        "Your fit is already fire! Maybe add some bold accessories?",
        "Consider layering to create more visual interest 🔥"
      ]
    };
  }
}

// 4. Caption Generator - Gen Z captions for outfits
async function getOutfitCaptions(imageUrl, vibe = "") {
  try {
    const prompt = `Generate 3 Gen Z captions for this outfit post on DripCheck:

    Image: ${imageUrl}
    Vibe: ${vibe}

    Make them spicy, confident, and trendy. Examples:
    - "Can't spell DRIP without ME 💧"
    - "Outfit louder than your ex's apology"
    - "Main character energy activated ✨"
    - "POV: You understood the assignment"

    Return JSON:
    {
      "captions": ["caption1", "caption2", "caption3"]
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        captions: [
          "Can't spell DRIP without ME 💧",
          "Outfit louder than your ex's apology",
          "Main character energy activated ✨"
        ]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      captions: [
        "Serving looks and taking names 🔥",
        "This fit said 'pick me' and I said 'bet' ✨",
        "POV: You understood the assignment 💫"
      ]
    };
  }
}

module.exports = { 
  getDripScore, 
  getBattleJudge, 
  getStyleTips, 
  getOutfitCaptions 
};
