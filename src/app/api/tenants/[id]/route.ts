import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = 'SELECT * FROM tenants WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, plan } = await request.json();
    const { id } = params;
    const query = 'UPDATE tenants SET name = $1, plan = $2 WHERE id = $3 RETURNING *';
    const values = [name, plan, id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const query = 'DELETE FROM tenants WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await db.query(query, values);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
