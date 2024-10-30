import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Missing OpenAI API key. Please ensure OPENAI_API_KEY is set in the environment variables.');
}

const openai = new OpenAI({ apiKey });

interface Params {
  category: string;
}

const categoryToUrlMap: Record<string, string> = {
  'audits': 'audits-and-reports',
  'financial-reports': 'reports',
  'data sites': 'data',
  'budget': 'budgets'
};

export async function GET(request: Request, { params }: { params: Params }) {
  const { category } = params;
  const normalizedCategory = category.toLowerCase();
  const urlCategory = categoryToUrlMap[normalizedCategory];

  if (!urlCategory) {
    console.error(`Invalid category: ${category}`);
    return NextResponse.json(
      { error: 'Invalid category. Please provide a valid category.' },
      { status: 400 }
    );
  }

  const url = `https://controller.lacity.gov/${encodeURIComponent(urlCategory)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch content from the URL:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch content for the selected category.', response },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const pageContent = $('body').text().trim().substring(0, 1000);

    if (!pageContent) {
      console.error('No content found on the page for category:', category);
      return NextResponse.json(
        { error: 'No content found for the selected category.' },
        { status: 404 }
      );
    }
      console.log('Delaying API call to avoid rate limiting...');
    // await delay(5000);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert assistant specializing in creating detailed, challenging multiple-choice trivia questions based on provided content. The questions should be nuanced, with subtle distinctions in the answer choices that require careful reading and understanding of the material."
        },
        {
          role: "user",
          content: `Using the following content from the LA City Controller's website, generate a complex, detailed multiple-choice trivia question. The question should require in-depth knowledge of the topic, and all options should be plausible but only one correct:\n\n${pageContent}\n\nProvide the response in the format:\nQuestion: [Your challenging question here]\nOptions:\nA. [Option A]\nB. [Option B]\nC. [Option C]\nD. [Option D]\nCorrect Answer: [Correct option]`
        }
      ],
      max_tokens: 200,
      temperature: 0.9,
    });    

    console.log('OpenAI API response:', completion);

    const generatedText = completion.choices[0]?.message?.content || '';
    const match = generatedText.match(/Question:\s*(.+?)\s*Options:\s*A\.\s*(.+?)\s*B\.\s*(.+?)\s*C\.\s*(.+?)\s*D\.\s*(.+?)\s*Correct Answer:\s*(.+)/);
    
    if (match) {
      const question = match[1].trim();
      const options = {
        A: match[2].trim(),
        B: match[3].trim(),
        C: match[4].trim(),
        D: match[5].trim(),
      };
      const correctAnswer = match[6].trim();
    
      return NextResponse.json({ question, options, correctAnswer });
    } else {
      console.error('Failed to parse the response correctly');
      console.error(`Generated text: ${generatedText}`);
      
      return NextResponse.json(
        { error: 'Invalid response format from OpenAI.' },
        { status: 500 }
      );
    }    
  }  catch (error: unknown) {
    if (error instanceof Error) {
      // if ((error as any).name === 'RateLimitError' || (error as any).status === 429) {
      //   console.error('Rate limit exceeded:', error);
      //   return NextResponse.json(
      //     { error: 'Rate limit exceeded. Please try again later.' },
      //     { status: 429 }
      //   );
      // }
      // console.error('Error generating question:', error.message);
      return NextResponse.json(
        { error: 'An error occurred while generating the question. Please try again later.' },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred.' },
        { status: 500 }
      );
    }
  }
}
