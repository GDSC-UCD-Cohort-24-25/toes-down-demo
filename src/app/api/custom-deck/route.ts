import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    let words: string[] = [];
    
    // Get the deck name
    let deckName = (data.get('deckName') as string)?.trim();
    if (!deckName) {
      return NextResponse.json(
        { error: 'Deck name is required' },
        { status: 400 }
      );
    }

    // Sanitize the deck name: replace spaces with underscores and remove special characters
    deckName = deckName.toLowerCase().replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '_');
    
    // Handle file upload
    const file = data.get('file') as File;
    if (file) {
      const text = await file.text();
      words = text.split('\n').map(word => word.trim()).filter(word => word);
    } else {
      // Handle direct word list
      const wordList = data.get('words') as string;
      if (wordList) {
        words = wordList.split('\n').map(word => word.trim()).filter(word => word);
      }
    }

    if (words.length === 0) {
      return NextResponse.json(
        { error: 'No words provided' },
        { status: 400 }
      );
    }

    // Check if deck name already exists
    const dataDirectory = path.join(process.cwd(), 'src/data');
    if (fs.existsSync(path.join(dataDirectory, `${deckName}.txt`))) {
      return NextResponse.json(
        { error: 'A deck with this name already exists' },
        { status: 400 }
      );
    }
    
    // Save the custom deck
    fs.writeFileSync(
      path.join(dataDirectory, `${deckName}.txt`),
      words.join('\n')
    );

    return NextResponse.json({ deckName });
  } catch (error) {
    console.error('Error creating custom deck:', error);
    return NextResponse.json(
      { error: 'Failed to create custom deck' },
      { status: 500 }
    );
  }
} 