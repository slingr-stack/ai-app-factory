import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const contact1 = await prisma.contact.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '555-555-5555',
    },
  })
  console.log({ contact1 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
