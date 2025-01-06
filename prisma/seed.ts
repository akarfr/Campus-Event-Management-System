import db from "@/lib/db";
import bcrypt from "bcrypt";

const main = async () => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 12);

    await db.user.create({
      data: {
        fullname: "Admin User",
        email: "admin@user.com",
        hashedPassword,
        role: "ORGANIZER",
      },
    });

    console.log(`Database has been seeded. 🌱`);
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
