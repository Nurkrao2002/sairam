import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, role, tenant_id } = await request.json();
    const id = `usr_${Date.now()}`;
    const avatar = `https://i.pravatar.cc/150?u=${id}`;
    const query = 'INSERT INTO users (id, name, email, role, avatar, tenant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [id, name, email, role, avatar, tenant_id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
