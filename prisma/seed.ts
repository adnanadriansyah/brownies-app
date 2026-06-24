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
  console.log('✓ Admin:', admin.email, '(password: admin123)')

  // Categories
  const cats: { name: string; slug: string }[] = [
    { name: 'Klasik', slug: 'klasik' },
    { name: 'Fudgy', slug: 'fudgy' },
    { name: 'Premium', slug: 'premium' },
  ]
  const categoryIds: Record<string, string> = {}
  for (const c of cats) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    })
    categoryIds[c.slug] = cat.id
    console.log('  ✓ Category:', cat.name)
  }

  // Products
  const products = [
    { name: 'Brownies Classic', slug: 'brownies-classic', price: 45000, stock: 50, categorySlug: 'klasik' },
    { name: 'Fudgy Brownies', slug: 'fudgy-brownies', price: 50000, stock: 40, categorySlug: 'fudgy' },
    { name: 'Chocolate Fudgy Ganache', slug: 'chocolate-fudgy-ganache', price: 55000, stock: 30, categorySlug: 'fudgy' },
    { name: 'Toffee Buttery Sweets', slug: 'toffee-buttery-sweets', price: 52000, stock: 25, categorySlug: 'premium' },
    { name: 'Condensed Milk Brownies', slug: 'condensed-milk-brownies', price: 50000, stock: 35, categorySlug: 'klasik' },
    { name: 'Chocolate Strawberry Fudge', slug: 'chocolate-strawberry-fudge', price: 60000, stock: 20, categorySlug: 'premium' },
  ]
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price, stock: p.stock, categoryId: categoryIds[p.categorySlug] },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        categoryId: categoryIds[p.categorySlug],
      },
    })
    console.log('  ✓ Product:', p.name)
  }

  console.log('\n✅ Seed complete')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
