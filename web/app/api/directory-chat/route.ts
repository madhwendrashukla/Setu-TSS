import { NextResponse } from 'next/server';
import { grantsData } from '@/lib/data/grants';
import { investorsData } from '@/lib/data/Investors/investors';
import { incubatorsData } from '@/lib/data/Incubators and Accelerators/incubators';
import { eventsData } from '@/lib/data/events';
import { pitchDecksData } from '@/lib/data/pitchDecks';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.NVIDIA_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: `I'm currently in 'offline' mode as my credentials aren't set up yet. Please check back once the team connects my brain!`
            });
        }

        // --- COMPRESSED KNOWLEDGE BASE (RAG) ---
        const grantsBrief = grantsData.slice(0, 15).map(g => `${g.name}: ${g.fundingSupport} for ${g.idealStage} (${g.focusSector})`).join('; ');
        const investorsBrief = investorsData.slice(0, 15).map(i => `${i.name} (${i.type}): ${i.stages.join(', ')} stages in ${i.industries.slice(0, 3).join(', ')}`).join('; ');
        const incubatorsBrief = incubatorsData.slice(0, 15).map(inc => `${inc.name} in ${inc.location}: ${inc.type}, ${inc.fundingSupport}`).join('; ');
        const eventsBrief = eventsData.slice(0, 10).map(e => `${e.eventName} (${e.startDate} ${e.month})`).join('; ');
        const decksBrief = pitchDecksData.slice(0, 10).map(d => `${d.company} (${d.round}): ${d.keyLesson}`).join('; ');

        const systemPrompt = {
            role: "system",
            content: `You are the Lead Advisor at Setu - TheStartupSchool. You are an expert in the Indian startup ecosystem.

PERSONALITY:
- Be direct, professional, yet helpful. NO "AI buzzwords" (don't say "unleashing", "comprehensive", "leveraging", "as an AI model").
- Speak like a human mentor. If you don't know something, be honest.
- IMPORTANT: You understand broken English, typos, and informal language (e.g., "seed grant in krnataka", "how get muny for startup"). Be smart and helpful regardless of the user's grammar.

KNOWLEDGE BASE:
- Grants: ${grantsBrief}... (and others)
- Investors: ${investorsBrief}... (and others)
- Incubators: ${incubatorsBrief}... (and others)
- Events: ${eventsBrief}... (and others)
- Pitch Decks: ${decksBrief}... (and others)

REDIRECTIONS (CRITICAL RULE):
If a user wants to SEE, GO TO, or FIND a specific tool/page, MUST output EXACTLY: __REDIRECT:URL__
- Tools Hub: /tools
- Events Calendar: /tools/founder-calendar
- Pitch Decks: /tools/pitch-decks
- Cap Table: /tools/cap-table-simulator
- Financial Model: /tools/financial-modeler
- Investors: /tools/incubator-search/investors
- Incubators: /tools/incubators-accelerators
- Grants: /tools/incubator-search/grants
- Home: /
- Mentors: /mentors

If just chatting, answer normally using markdown for bolding.`
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        try {
            const fetchResponse = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "meta/llama-3.1-8b-instruct",
                    messages: [systemPrompt, ...messages],
                    max_tokens: 400,
                    temperature: 0.1,
                    top_p: 0.9
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!fetchResponse.ok) {
                return NextResponse.json({
                    reply: "I'm having a bit of trouble connecting to my knowledge source right now. Could you ask me again in a moment?"
                });
            }

            const data = await fetchResponse.json();
            let reply = data.choices[0].message.content;

            // Clean up the reply from common AI-isms if they slip through
            reply = reply.replace(/Certainly!/g, '').replace(/I'm happy to help/g, '').trim();

            return NextResponse.json({ reply });

        } catch (e: any) {
            clearTimeout(timeoutId);
            if (e.name === 'AbortError') return NextResponse.json({ reply: "I timed out trying to find that for you. Try a simpler question?" });
            throw e;
        }
    } catch (error: any) {
        console.error('Fatal Directory Chat API error:', error);
        return NextResponse.json({ reply: "Something went wrong. Let's try again." });
    }
}
