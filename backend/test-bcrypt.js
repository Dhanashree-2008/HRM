import bcrypt from "bcrypt";

const run = async () => {
  const plain = "123456";
  const hash = await bcrypt.hash(plain, 10);
  console.log("New bcrypt hash for 123456:");
  console.log(hash);
};

run();
