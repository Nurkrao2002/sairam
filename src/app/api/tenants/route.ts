import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM tenants');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, plan } = await request.json();
    const id = `ten_${Date.now()}`;
    const users = 1;
    const last_active = 'Just now';
    const status = 'Provisioning';
    const query = 'INSERT INTO tenants (id, name, plan, users, last_active, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [id, name, plan, users, last_active, status];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
