import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, role } = await request.json();
    const { id } = params;
    const query = 'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *';
    const values = [name, email, role, id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
