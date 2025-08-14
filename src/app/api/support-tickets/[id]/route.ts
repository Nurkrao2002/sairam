import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = 'SELECT * FROM support_tickets WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const { id } = params;
    const query = 'UPDATE support_tickets SET status = $1, last_updated_at = NOW() WHERE id = $2 RETURNING *';
    const values = [status, id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
