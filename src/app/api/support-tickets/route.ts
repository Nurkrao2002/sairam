import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM support_tickets');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { subject, description, priority, tenant, user } = await request.json();
    const id = `T-${Math.floor(Math.random() * 9000) + 1000}`;
    const status = 'Open';
    const query = 'INSERT INTO support_tickets (id, subject, priority, status, created_at, last_updated_at, tenant_id, user_email) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6) RETURNING *';
    const values = [id, subject, priority, status, tenant, user];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
