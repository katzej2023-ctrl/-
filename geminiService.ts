import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedTaskContent, TaskConfig } from "../types";

const SYSTEM_INSTRUCTION = `
You are Kuchendeutsch, a rigorous, functionalist TestDaF speaking examiner.
Your design philosophy is Bauhaus: Form follows function.
Your analysis is objective, critical, and structured.

Roles:
1. Generator: Create valid TestDaF speaking tasks.
2. Examiner: Analyze audio/text submissions strictly according to TestDaF criteria (Structure, Logic, Grammar, Vocabulary, Fluency).

Output Style:
- Use Markdown.
- Headers are bold.
- No decorative fluff.
- Tables for scores.
- Charts data must be realistic.
`;

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTaskContent = async (taskConfig: TaskConfig): Promise<GeneratedTaskContent> => {
  const ai = getClient();
  
  const isChartTask = taskConfig.id === 3 || taskConfig.id === 6;

  const prompt = `
    Generate a unique TestDaF Speaking ${taskConfig.title}.
    Context: ${taskConfig.context}.
    Interlocutor: ${taskConfig.interlocutor}.
    
    Return a JSON object with:
    - germanTitle: A short German title for the topic.
    - germanTaskText: The task description in German (instructions only, no fluff).
    - chineseInstructions: A concise translation of the situation and requirement in Chinese.
    - openingLineHint: A suggestion for the first sentence (Redemittel) in German.
    ${isChartTask ? '- chartTitle: Title of the chart.' : ''}
    ${isChartTask ? '- chartData: An array of objects with "name" (string, e.g. Year/Category) and "value" (number). Limit to 4-5 data points.' : ''}
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      germanTitle: { type: Type.STRING },
      germanTaskText: { type: Type.STRING },
      chineseInstructions: { type: Type.STRING },
      openingLineHint: { type: Type.STRING },
      chartTitle: { type: Type.STRING, nullable: true },
      chartData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            value: { type: Type.NUMBER },
          }
        },
        nullable: true
      }
    },
    required: ["germanTitle", "germanTaskText", "chineseInstructions", "openingLineHint"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as GeneratedTaskContent;
  } catch (error) {
    console.error("Task generation failed:", error);
    // Fallback content to prevent app crash
    return {
      germanTitle: "Fehler bei der Generierung",
      germanTaskText: "Bitte versuchen Sie es erneut.",
      chineseInstructions: "生成失败，请重试。",
      openingLineHint: "Entschuldigung...",
      chartData: isChartTask ? [{ name: 'A', value: 10 }, { name: 'B', value: 20 }] : undefined
    };
  }
};

export const analyzeAudioSubmission = async (
  audioBase64: string, 
  taskConfig: TaskConfig, 
  taskContent: GeneratedTaskContent
): Promise<string> => {
  const ai = getClient();

  // Remove data URL prefix if present for the API call
  const cleanBase64 = audioBase64.replace(/^data:audio\/[a-z]+;base64,/, "");

  const prompt = `
    Analyze this audio recording for TestDaF Speaking ${taskConfig.title}.
    Topic: ${taskContent.germanTitle}.
    Context: ${taskConfig.context}.
    
    Perform the "Step 4: Deep Analysis" protocol:
    
    1. **Process Logic**: Briefly trace the user's argument flow (logic chain). Use '->' arrows.
    2. **Score Table**: Create a Markdown table with columns: Dimension, Score (0-5), Deep Assessment (Chinese), Correction/Upgrade.
       Dimensions: Structure & Logic, Grammar & Syntax, Vocabulary Diversity, Exam Strategy.
    3. **Summary**:
       - 📜 Wortschatz-Sammelbuch (3-5 key terms from the topic used or missed).
       - 🧩 Grammatik-Lernblock (Explain one major grammar point relevant to the user's performance).
       
    Language: Feedback in Chinese/German mix as specified. Tone: Strict, academic, Bauhaus functional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'audio/webm', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Analysis failed", error);
    return "Error analyzing audio. Please ensure your microphone is working and try again.";
  }
};
