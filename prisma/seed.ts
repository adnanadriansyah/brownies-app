import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@velours.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Admin Velours',
      email: 'admin@velours.com',
      password,
      role: 'ADMIN',
    },
  })

  console.log('✓ Admin created:', admin.email, '(password: admin123)')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
