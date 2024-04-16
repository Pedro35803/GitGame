import { db } from "../db"

export const nextOrderLevel = async (id_level) => {
  const count = await db.orderLevel.count({ where: { id_level } })
  return count + 1
}