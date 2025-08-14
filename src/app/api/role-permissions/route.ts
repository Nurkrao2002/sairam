import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT r.name as role_name, p.description as permission_description
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
    `;
    const { rows } = await db.query(query);
    const rolesMap = rows.reduce((acc, row) => {
      if (!acc[row.role_name]) {
        acc[row.role_name] = [];
      }
      if (row.permission_description) {
        acc[row.role_name].push(row.permission_description);
      }
      return acc;
    }, {});
    return NextResponse.json(rolesMap);
  } catch (error) {
    console.error('Error fetching role-permissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { roleName, permissions } = await request.json();

    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', [roleName]);
      const roleId = roleResult.rows[0].id;

      await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);

      if (permissions.length > 0) {
        const permissionsResult = await client.query('SELECT id, description FROM permissions');
        const permissionsMap = permissionsResult.rows.reduce((acc, p) => {
          acc[p.description] = p.id;
          return acc;
        }, {});

        const insertQuery = 'INSERT INTO role_permissions (role_id, permission_id) VALUES ' +
          permissions.map((p: string) => `(${roleId}, ${permissionsMap[p]})`).join(',');
        await client.query(insertQuery);
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating role-permissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
