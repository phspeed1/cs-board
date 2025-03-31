import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL이 설정되지 않았습니다.');
  }

  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('마이그레이션을 시작합니다...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('마이그레이션이 완료되었습니다.');

  await connection.end();
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('마이그레이션 오류:', err);
  process.exit(1);
}); 