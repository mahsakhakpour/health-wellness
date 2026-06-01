import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const parent = await prisma.user.upsert({
    where: { email: 'parent@example.com' },
    update: {},
    create: {
      email: 'parent@example.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: 'PARENT',
    },
  })

  const child = await prisma.child.create({
    data: {
      name: 'Alex Johnson',
      birthDate: new Date('2019-05-15'),
      diagnoses: JSON.stringify(['Autism Spectrum Disorder', 'Speech Delay']),
      bloodType: 'O+',
      allergies: JSON.stringify(['Penicillin']),
      parentId: parent.id,
    },
  })

  await prisma.medication.createMany({
    data: [
      {
        name: 'Melatonin',
        dosage: '2mg',
        frequency: 'Bedtime',
        purpose: 'Sleep support',
        startDate: new Date('2024-01-15'),
        childId: child.id,
      },
    ],
  })

  await prisma.therapyGoal.createMany({
    data: [
      {
        area: 'Speech',
        description: 'Use 2-word phrases independently',
        currentLevel: 45,
        targetLevel: 80,
        childId: child.id,
      },
      {
        area: 'Social',
        description: 'Make eye contact during conversation',
        currentLevel: 40,
        targetLevel: 85,
        childId: child.id,
      },
      {
        area: 'Behavior',
        description: 'Sit calmly for 10 minutes',
        currentLevel: 50,
        targetLevel: 90,
        childId: child.id,
      },
    ],
  })

  console.log('Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
  