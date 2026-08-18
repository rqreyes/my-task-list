import { pool } from "@/app/lib/database";

const randomNum = () => Math.floor(Math.random() * 1000000 + 1);

const checkIsIdExists = async (query: string, id: number) => {
  const { rows } = await pool.query(query, [id]);

  return Boolean(rows[0]);
};

export const generateId = (query: string) => {
  let idNew = 0;

  const changeNum = async () => {
    idNew = randomNum();

    const isIdExists = await checkIsIdExists(query, idNew);

    // if ID exists already
    // then execute function recursively
    if (isIdExists) changeNum();
  };
  changeNum();

  return idNew;
};
