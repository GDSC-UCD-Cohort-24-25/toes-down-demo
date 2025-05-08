import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { deckName } = await request.json();
    
    if (!deckName) {
      return NextResponse.json(
        { error: 'Deck name is required' },
        { status: 400 }
      );
    }

    // Only allow deletion of custom decks (those that start with custom_ or were user-created)
    const dataDirectory = path.join(process.cwd(), 'src/data');
    const filePath = path.join(dataDirectory, `${deckName}.txt`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom deck:', error);
    return NextResponse.json(
      { error: 'Failed to delete custom deck' },
      { status: 500 }
    );
  }
} 