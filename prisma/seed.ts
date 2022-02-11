import {PrismaClient} from "@prisma/client"
import {faker} from "@faker-js/faker"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function seed() {
  // const title = faker.name.title()
  // const description = faker.lorem.paragraphs()
  // for(let i = 0; i < 5; i++) {
  //   await db.post.create({
  //     data: {
  //       title: faker.name.title(),
  //       description: faker.lorem.paragraphs()
  //     }
  //   })
  // }
  const passwordHash = await bcrypt.hash('123456', 10)
  await db.user.create({
    data: {
      username: "bangsyir",
      fullname: "bangsyir",
      email: "test@gmail.com",
      passwordHash: passwordHash
    }
  })
}

seed()
